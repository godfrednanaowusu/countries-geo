"""Build the countries-geo dataset from the cached upstream sources (see fetch.py).

Usage: python3 -I build.py [--cache DIR] [--out DIR] [--rebuild-geoms]

Writes compact JSON into package/src/data (consumed by the TypeScript library) and a
build report (build-report.json) used by audit.py.

Pipeline
  1. countries   countries.base.json (ISO 3166-1, curated names / continents / phone codes)
  2. states      ISO 3166-2 first-level subdivisions (pycountry) + documented overrides
  3. polygons    Natural Earth / geoBoundaries, matched to ISO codes (used for centres)
  4. cities      GeoNames cities1000 + Wikidata cities/towns, de-duplicated
  5. city→state  GeoNames admin hierarchy joined to ISO codes; polygons as fallback
  6. refinement  split-up states without a current polygon get a Voronoi share of the old one
  7. centres     equal-area centroids constrained to land (geo.centre)
  8. time zones  GeoNames per city, aggregated by population; zone.tab for countries
  9. i18n        CLDR (countries), Wikidata (states, Wikidata cities), GeoNames (cities)
"""
import argparse
import collections
import csv
import difflib
import io
import json
import math
import os
import pickle
import re
import sys
import unicodedata
import warnings
import zipfile

import numpy as np
import pycountry
from shapely.geometry import MultiPoint, Point, box
from shapely.ops import voronoi_diagram
from shapely.strtree import STRtree

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config  # noqa: E402
import geo  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(os.path.dirname(HERE))


def log(*a):
    print(*a, file=sys.stderr, flush=True)


def norm(s):
    s = unicodedata.normalize('NFKD', s or '')
    s = ''.join(ch for ch in s if not unicodedata.combining(ch))
    s = s.replace('ø', 'o').replace('æ', 'ae').replace('ð', 'd').replace('þ', 'th').replace('ł', 'l').replace('đ', 'd')
    s = re.sub(r"[’'`ʻ]", '', s.lower())
    s = re.sub(r'[^a-z0-9]+', ' ', s)
    return s.strip()


def strip_suffixes(n):
    """Normalised name with administrative type words removed ("zambezi region" -> "zambezi")."""
    n = norm(n)
    for suf in sorted(config.LABEL_SUFFIXES, key=len, reverse=True):
        s = ' ' + suf.lower()
        if n.endswith(s) and len(n) > len(s) + 2:
            return n[:-len(s)]
        p = suf.lower() + ' of '
        if n.startswith(p):
            return n[len(p):]
    return n


def qid(uri):
    return uri.rsplit('/', 1)[-1] if uri else ''


def parse_point(wkt):
    m = re.match(r'Point\(([-\d.eE]+) ([-\d.eE]+)\)', wkt or '', re.I)
    return (float(m.group(1)), float(m.group(2))) if m else None


def rnd(x):
    return round(float(x), config.PRECISION)


def km_to(geom, lon, lat):
    return geom.distance(Point(lon, lat)) * 111.2 * max(math.cos(math.radians(lat)), 0.2)


# --------------------------------------------------------------------------- sources

class Sources:
    def __init__(self, cache):
        self.cache = cache

    def path(self, *p):
        return os.path.join(self.cache, *p)

    def wikidata_iso2(self):
        items = collections.defaultdict(dict)
        for r in csv.DictReader(open(self.path('wikidata', 'iso2_items.csv'), encoding='utf-8')):
            q = qid(r['item'])
            it = items[r['code']].setdefault(q, {'gn': set(), 'end': set(), 'coord': None, 'succ': set()})
            if r['gn']:
                it['gn'].add(r['gn'])
            if r['end']:
                it['end'].add(r['end'][:10])
            if r['coord'] and not it['coord']:
                it['coord'] = parse_point(r['coord'])
            if r.get('succ'):
                it['succ'].add(qid(r['succ']))
        labels = collections.defaultdict(dict)
        for r in csv.DictReader(open(self.path('wikidata', 'iso2_labels.csv'), encoding='utf-8')):
            labels[qid(r['item'])][r['lang']] = r['l']
        return items, labels

    def wikidata_country_coords(self):
        out = {}
        for r in csv.DictReader(open(self.path('wikidata', 'countries.csv'), encoding='utf-8')):
            pt = parse_point(r.get('coord'))
            if pt and r['cc'] not in out:
                out[r['cc']] = pt
        return out

    def country_populations(self):
        out = collections.Counter()
        for line in open(self.path('geonames', 'countryInfo.txt'), encoding='utf-8'):
            if line.startswith('#'):
                continue
            p = line.rstrip('\n').split('\t')
            cc = config.FOLD_INTO.get(p[0], (p[0],))[0]
            out[cc] += int(p[7] or 0)
        return out

    def geonames_admin(self, name):
        rows = []
        for line in open(self.path('geonames', name), encoding='utf-8'):
            p = line.rstrip('\n').split('\t')
            if len(p) >= 4:
                rows.append({'code': p[0], 'name': p[1], 'ascii': p[2], 'gn': p[3]})
        return rows


# --------------------------------------------------------------------------- countries

def load_countries():
    return json.load(open(os.path.join(HERE, 'countries.base.json'), encoding='utf-8'))


# --------------------------------------------------------------------------- states

def wd_pick(items):
    """Choose the current Wikidata item among those carrying an ISO 3166-2 code."""
    if not items:
        return None, None
    live = [(q, it) for q, it in items.items() if not it['end']]
    pool = live or list(items.items())
    pool.sort(key=lambda x: (not x[1]['gn'], x[0]))
    return pool[0]


def clean_iso_name(name):
    name = re.sub(r'\s*\[.*?\]', '', name)
    if re.search(r', (Région|Province|Provincia|Région de|Region|Distrito)', name):
        name = name.split(', ')[0]
    return name.strip()


def english_name(label, iso_name, extra=()):
    if not label:
        return iso_name
    targets = {norm(iso_name)} | {norm(x) for x in extra}
    for suf in sorted(config.LABEL_SUFFIXES, key=len, reverse=True):
        for form in (' ' + suf, ' ' + suf.lower()):
            if label.endswith(form):
                rest = label[:-len(form)].strip()
                if norm(rest) in targets:
                    return rest
    return label


def build_states(countries, wd_items, wd_labels, report):
    subs = list(pycountry.subdivisions)
    by_code = {s.code: s for s in subs}
    children = collections.defaultdict(list)
    for s in subs:
        if s.parent_code:
            children[s.parent_code].append(s)

    states = []
    for c in countries:
        cc = c['iso2']
        top = [s for s in subs if s.country_code == cc and not s.parent_code]
        if cc in config.FLATTEN_TOP_LEVEL:
            flat = []
            for t in top:
                flat.extend(children.get(t.code) or [t])
            top = flat
        codes = {s.code: s.type for s in top if s.code not in config.EXCLUDE_SUBDIVISIONS}
        if cc in config.APPLY_WIKIDATA_DISSOLUTIONS:
            for code in list(codes):
                items = wd_items.get(code)
                if items and all(it['end'] for it in items.values()):
                    report['dissolved_removed'].append(code)
                    del codes[code]
            for code, typ in config.ADD_SUBDIVISIONS.items():
                if code.startswith(cc + '-'):
                    codes[code] = typ
        for code in sorted(codes):
            s = by_code.get(code)
            q, it = wd_pick(wd_items.get(code, {}))
            labels = wd_labels.get(q, {}) if q else {}
            iso_name = clean_iso_name(s.name) if s else (labels.get('en') or code)
            name = english_name(labels.get('en'), iso_name)
            gns = set()
            for item in wd_items.get(code, {}).values():
                if not item['end']:
                    gns |= item['gn']
            states.append({
                'code': code, 'country': cc, 'name': name, 'type': codes[code],
                'iso_name': iso_name, 'wikidata': q, 'wd_coord': it['coord'] if it else None,
                'geonames': sorted(gns), 'labels': labels,
            })
    have = {s['code'] for s in states}
    for _src, (_host, code) in config.FOLD_INTO.items():
        assert code in have, 'missing folded state ' + code
    # Successors of dissolved codes, only for merges (exactly one successor). Splits are
    # handled later by partitioning the old polygon among the new units.
    q2code = {}
    for code, items in wd_items.items():
        for q in items:
            q2code.setdefault(q, code)
    successor = {}
    for code, items in wd_items.items():
        if code.split('-')[0] in config.APPLY_WIKIDATA_DISSOLUTIONS and all(it['end'] for it in items.values()):
            succ = {q2code[sq] for it in items.values() for sq in it['succ'] if sq in q2code and q2code[sq] != code}
            if len(succ) == 1:
                successor[code] = succ.pop()
    report['state_count'] = len(states)
    return states, by_code, successor


class NameMatcher:
    """Matches free-text unit names to a country's states (exact, suffix-stripped, fuzzy).

    A key shared by several states (e.g. "Buenos Aires" for the city and the province) is
    ambiguous and never used as an exact match.
    """

    def __init__(self, states_of_country):
        self.keys = collections.defaultdict(set)  # key -> codes
        self.by_code = collections.defaultdict(set)  # code -> keys
        for s in states_of_country:
            names = {s['name'], s['iso_name']} | {v for k, v in s['labels'].items() if k in ('en', 'fr', 'de', 'es', 'pt')}
            for n in names:
                for k in (norm(n), strip_suffixes(n)):
                    if k:
                        self.keys[k].add(s['code'])
                        self.by_code[s['code']].add(k)

    def match_exact(self, *names):
        for n in names:
            for k in (norm(n), strip_suffixes(n)):
                codes = self.keys.get(k)
                if codes and len(codes) == 1:
                    return next(iter(codes))
        return None

    def consistent(self, code, *names):
        """True when any of the names plausibly refers to the given state."""
        own = self.by_code.get(code, set())
        for n in names:
            for k in (norm(n), strip_suffixes(n)):
                if not k:
                    continue
                if k in own or any(difflib.SequenceMatcher(None, k, o).ratio() >= 0.8 or k in o or o in k for o in own):
                    return True
        return False

    def match(self, *names):
        hit = self.match_exact(*names)
        if hit:
            return hit
        scores = collections.defaultdict(float)
        for n in names:
            k = strip_suffixes(n)
            if not k:
                continue
            for cand, codes in self.keys.items():
                r = difflib.SequenceMatcher(None, k, cand).ratio()
                for c in codes:
                    scores[c] = max(scores[c], r)
        if not scores:
            return None
        ranked = sorted(scores.items(), key=lambda x: -x[1])
        best = ranked[0]
        second = ranked[1][1] if len(ranked) > 1 else 0.0
        return best[0] if best[1] >= 0.86 and best[1] - second >= 0.04 else None


# --------------------------------------------------------------------------- polygons

COUNTRY_FROM_ADM0_A3 = {'SOL': 'SO', 'CYN': 'CY', 'CNM': 'CY', 'KOS': 'RS', 'USG': 'CU'}
# (target country, source country, admin-1 iso codes or (adm0_a3, name))
CARVE_ADMIN1 = [
    ('GF', 'FR', ['FR-GF']), ('MQ', 'FR', ['FR-MQ']), ('GP', 'FR', ['FR-GP']),
    ('RE', 'FR', ['FR-RE']), ('YT', 'FR', ['FR-YT']),
    ('UA', 'RU', ['UA-43', 'UA-40']),
    ('SJ', 'NO', ['NO-21']),
    ('TK', 'NZ', ['TK-X01~']),
    ('BQ', 'NL', ['NL-BQ1', 'NL-BQ2', 'NL-BQ3']),
    ('CC', 'AU', [('IOA', 'Cocos (Keeling) Islands')]),
    ('CX', 'AU', [('IOA', 'Christmas Island')]),
]
CARVE_BBOX = [
    ('SJ', 'NO', (-9.3, 70.7, -7.8, 71.3)),   # Jan Mayen
    ('BV', 'NO', (3.0, -54.7, 3.8, -54.2)),   # Bouvet Island
]
# Natural Earth admin-1 codes that are outdated or belong to another ISO 3166-1 entry.
NE_CODE_ALIASES = {
    'MX-DIF': 'MX-CMX', 'NL-BQ1': 'BQ-BO', 'NL-BQ2': 'BQ-SA', 'NL-BQ3': 'BQ-SE',
}
# States whose polygon is a Natural Earth admin-0 feature.
STATE_FROM_ADM0 = {'CLP': 'FR-CP'}
FOLDED_ADM0 = {v[1]: k for k, v in config.FOLD_INTO.items()}  # CN-TW -> TW


def build_country_geoms(src):
    g0 = json.load(open(src.path('naturalearth', 'ne_10m_admin_0_countries.geojson'), encoding='utf-8'))
    g1 = json.load(open(src.path('naturalearth', 'ne_10m_admin_1_states_provinces.geojson'), encoding='utf-8'))
    raw = collections.defaultdict(list)
    adm0 = {}
    for f in g0['features']:
        p = f['properties']
        adm0[p['ADM0_A3']] = geo.load_geom(f['geometry'])
        cc = p['ISO_A2_EH']
        if cc == '-99' or cc == 'XK':
            cc = COUNTRY_FROM_ADM0_A3.get(p['ADM0_A3'])
        if cc:
            raw[cc].append(adm0[p['ADM0_A3']])
    geoms = {cc: geo.union(gs) for cc, gs in raw.items()}
    a1 = {}
    for f in g1['features']:
        p = f['properties']
        a1[p['iso_3166_2']] = f['geometry']
        a1[(p['adm0_a3'], p['name'])] = f['geometry']
    for target, source, keys in CARVE_ADMIN1:
        piece = geo.union([geo.load_geom(a1[k]) for k in keys if k in a1])
        if piece is None:
            continue
        if source in geoms:
            geoms[source] = geoms[source].difference(piece.buffer(0.01))
        geoms[target] = geo.union([geoms.get(target), piece]) if target in geoms else piece
    for target, source, bb in CARVE_BBOX:
        b = box(*bb)
        piece = geoms[source].intersection(b)
        if not piece.is_empty:
            geoms[source] = geoms[source].difference(b)
            geoms[target] = geo.union([geoms.get(target), piece]) if target in geoms else piece
    return geoms, adm0


def resolve_code(code, state_codes, by_code, successor):
    for _ in range(6):
        if code in state_codes:
            return code
        if code in successor:
            code = successor[code]
            continue
        s = by_code.get(code)
        if not s or not s.parent_code:
            return None
        code = s.parent_code
    return code if code in state_codes else None


def build_state_geoms(src, countries, states, by_code, successor, country_geoms, adm0, report):
    """Returns ({state code: polygon}, {country: [unlabelled leftover polygons]})."""
    g1 = json.load(open(src.path('naturalearth', 'ne_10m_admin_1_states_provinces.geojson'), encoding='utf-8'))
    gb_index = {m['boundaryISO']: m for m in json.load(open(src.path('geoboundaries', 'index.json')))}
    by_country = collections.defaultdict(list)
    for s in states:
        by_country[s['country']].append(s)
    iso3 = {c['iso2']: c['iso3'] for c in countries}

    ne = collections.defaultdict(lambda: collections.defaultdict(list))
    ne_left = collections.defaultdict(list)
    matchers = {cc: NameMatcher(sts) for cc, sts in by_country.items()}
    for f in g1['features']:
        p = f['properties']
        cc, code = p['iso_a2'], p['iso_3166_2']
        if p['adm0_a3'] == 'KOS':
            cc, code = 'RS', 'RS-KM'
        if code in ('UA-43', 'UA-40'):
            cc = 'UA'
        if code in NE_CODE_ALIASES:
            code = NE_CODE_ALIASES[code]
            cc = code[:2]
        if cc not in by_country:
            continue
        codes = {s['code'] for s in by_country[cc]}
        r = resolve_code(code, codes, by_code, successor)
        names = (p.get('name') or '', p.get('name_en') or '')
        named = matchers[cc].match_exact(*names)
        if r and named and named != r and p['adm0_a3'] != 'KOS' and not matchers[cc].consistent(r, *names):
            report['polygon_code_name_conflicts'].append([code, names[0], r, named])
            r = named  # stale code reused for another unit (e.g. Iran's 2020 renumbering)
        if not r:
            r = matchers[cc].match(*names)
        g = geo.load_geom(f['geometry'])
        if r:
            ne[cc][r].append(g)
        else:
            ne_left[cc].append(g)

    chosen, leftovers = {}, {}
    for c in countries:
        cc = c['iso2']
        sts = by_country.get(cc, [])
        if not sts:
            continue
        codes = {s['code'] for s in sts}
        pre = {}
        for s in sts:
            if s['code'] in FOLDED_ADM0 and FOLDED_ADM0[s['code']] in country_geoms:
                pre[s['code']] = country_geoms[FOLDED_ADM0[s['code']]]
        for a3, code in STATE_FROM_ADM0.items():
            if code in codes and a3 in adm0:
                pre[code] = adm0[a3]
        need = codes - set(pre)
        ne_set = {k: geo.union(v) for k, v in ne[cc].items() if k in need}
        ne_clean = set(ne_set) >= need and not ne_left[cc]

        gb_set, gb_left = {}, []
        meta = gb_index.get(iso3[cc])
        gpath = src.path('geoboundaries', iso3[cc] + '.geojson')
        if meta and os.path.exists(gpath):
            matcher = NameMatcher([s for s in sts if s['code'] in need])
            tmp = collections.defaultdict(list)
            for f in json.load(open(gpath, encoding='utf-8'))['features']:
                p = f['properties']
                r = None
                iso = (p.get('shapeISO') or '').strip()
                if iso and iso.lower() not in ('none', 'nan'):
                    r = resolve_code(iso, need, by_code, successor)
                    named = matcher.match_exact(p.get('shapeName') or '')
                    if r and named and named != r and not matcher.consistent(r, p.get('shapeName') or ''):
                        report['polygon_code_name_conflicts'].append([iso, p.get('shapeName'), r, named])
                        r = named
                if not r:
                    r = matcher.match(p.get('shapeName') or '')
                try:
                    g = geo.load_geom(f['geometry'])
                except Exception:
                    continue
                if r:
                    tmp[r].append(g)
                else:
                    gb_left.append(g)
            gb_set = {k: geo.union(v) for k, v in tmp.items()}
        gb_clean = set(gb_set) >= need and not gb_left

        if ne_clean:
            pick, source, left = ne_set, 'naturalearth', []
        elif gb_clean:
            pick, source, left = gb_set, 'geoboundaries', []
        elif len(gb_set) >= len(ne_set):
            # Prefer the more complete source; borrow missing units from the other one.
            pick, source, left = dict(gb_set), 'mixed', list(gb_left)
            for k, g in ne_set.items():
                pick.setdefault(k, g)
        else:
            pick, source, left = dict(ne_set), 'mixed', list(ne_left[cc])
            for k, g in gb_set.items():
                pick.setdefault(k, g)
        pick.update(pre)
        missing = sorted(codes - set(pick))
        if left:
            covered = geo.union(list(pick.values()))
            rest = geo.union(left)
            if covered is not None and rest is not None:
                rest = rest.difference(covered.buffer(0.005))
            left = [p for p in geo.parts(rest) if p.area > 1e-4] if rest is not None else []
        report['state_polygon_source'][cc] = {
            'source': source, 'missing': missing, 'ne_unmatched': len(ne_left[cc]), 'gb_unmatched': len(gb_left),
        }
        chosen.update(pick)
        if left:
            leftovers[cc] = left
    return chosen, leftovers


def refine_split_states(states, cities, state_geoms, leftovers, report):
    """Give states without a current polygon an approximate one.

    When a unit was split after the polygon sources were drawn, its territory is still part
    of an old polygon (the parent's, or an unmatched leftover). Cities labelled by the GeoNames
    hierarchy tell us which unit each place belongs to, so the old polygon is partitioned into
    Voronoi cells around those cities and the cells are merged per unit.
    """
    by_country = collections.defaultdict(list)
    for s in states:
        by_country[s['country']].append(s['code'])
    labelled = collections.defaultdict(list)
    for c in cities:
        if c.get('how') == 'admin' and c.get('state'):
            labelled[c['cc']].append(c)
    refined = {}
    for cc, codes in by_country.items():
        orphans = {k for k in codes if k not in state_geoms}
        if not orphans or cc not in labelled:
            continue
        pts = labelled[cc]
        regions = [(k, state_geoms[k]) for k in codes if k in state_geoms] + [(None, g) for g in leftovers.get(cc, [])]
        pieces = collections.defaultdict(list)
        for owner, region in regions:
            inside = [c for c in pts if region.contains(Point(c['lon'], c['lat']))]
            seeds = [c for c in inside if c['state'] == owner or c['state'] in orphans]
            if not any(c['state'] in orphans for c in seeds):
                continue
            if owner is None and len({c['state'] for c in seeds}) == 1:
                pieces[seeds[0]['state']].append(region)
                continue
            uniq = {}
            for c in seeds:
                uniq.setdefault((round(c['lon'], 4), round(c['lat'], 4)), c['state'])
            if len(uniq) < 2:
                continue
            with warnings.catch_warnings():
                warnings.simplefilter('ignore')
                cells = voronoi_diagram(MultiPoint([Point(*k) for k in uniq]), envelope=region.envelope.buffer(1))
            for cell in cells.geoms:
                for k, st in uniq.items():
                    if cell.contains(Point(*k)):
                        part = cell.intersection(region)
                        if not part.is_empty:
                            pieces[st].append(part)
                        break
        for st, ps in pieces.items():
            g = geo.union(ps)
            if g is not None and not g.is_empty:
                refined[st] = g
    for st, g in refined.items():
        state_geoms[st] = g
    report['voronoi_refined_states'] = sorted(refined)
    return refined


# --------------------------------------------------------------------------- centres

def compute_country_centres(countries, country_geoms, wd_country_coords, report):
    for c in countries:
        g = country_geoms.get(c['iso2'])
        if g is not None and not g.is_empty:
            (lon, lat), method = geo.centre(g)
            c['area'] = geo.area_km2(g)
        else:
            lon, lat = wd_country_coords[c['iso2']]
            method, c['area'] = 'wikidata-point', 0.0
        c['lon'], c['lat'], c['centre_method'] = lon, lat, method
        report['centre_method'][c['iso2']] = method


def compute_state_centres(states, state_geoms, refined, cities, countries, report):
    city_pts = collections.defaultdict(list)
    for c in cities:
        if c.get('state'):
            city_pts[c['state']].append((c['lon'], c['lat']))
    country = {c['iso2']: c for c in countries}
    for s in states:
        g = state_geoms.get(s['code'])
        if g is not None and not g.is_empty:
            (lon, lat), method = geo.centre(g)
            if s['code'] in refined:
                method = 'voronoi-approx'
            s['area'] = geo.area_km2(g)
        elif s['wd_coord']:
            (lon, lat), method, s['area'] = s['wd_coord'], 'wikidata-point', 0.0
        elif city_pts.get(s['code']):
            pts = city_pts[s['code']]
            lon, lat = geo.weighted_centre([(p, 1.0) for p in pts])
            method, s['area'] = 'mean-of-cities', 0.0
        else:
            c = country[s['country']]
            lon, lat, method, s['area'] = c['lon'], c['lat'], 'country-centre', 0.0
        s['lon'], s['lat'], s['centre_method'] = lon, lat, method
        report['centre_method'][s['code']] = method


def continent_centres(countries, states):
    out = {}
    by_cont = collections.defaultdict(list)
    for c in countries:
        by_cont[c['continent']].append(c)
    ru_states = [s for s in states if s['country'] == 'RU' and s['area'] > 0]
    ru_cont = next(c['continent'] for c in countries if c['iso2'] == 'RU')
    for cont, cs in by_cont.items():
        items = []
        for c in cs:
            if c['iso2'] != 'RU':
                items.append(((c['lon'], c['lat']), c['area'] or 1.0))
        for s in ru_states:  # Russia counts towards Europe west of the Urals, Asia east of them
            west = s['lon'] < config.URAL_LONGITUDE
            if (cont == 'EU' and west) or (cont == 'AS' and not west) or (cont == ru_cont and cont not in ('EU', 'AS')):
                items.append(((s['lon'], s['lat']), s['area']))
        out[cont] = geo.weighted_centre(items)
    return out


# --------------------------------------------------------------------------- cities

GN_COLS = ['id', 'name', 'ascii', 'alt', 'lat', 'lon', 'fclass', 'fcode', 'cc', 'cc2', 'a1', 'a2', 'a3', 'a4',
           'pop', 'elev', 'dem', 'tz', 'mod']


def load_geonames_cities(src, report):
    out = []
    for line in open(src.path('geonames', config.GEONAMES_CITIES), encoding='utf-8'):
        p = dict(zip(GN_COLS, line.rstrip('\n').split('\t')))
        if p['fcode'] in config.EXCLUDED_FEATURE_CODES:
            report['excluded_feature_codes'][p['fcode']] += 1
            continue
        cc, forced = p['cc'], None
        if cc in config.FOLD_INTO:
            cc, forced = config.FOLD_INTO[cc]
        elif cc in config.GEONAMES_COUNTRY_REMAP:
            cc, forced = config.GEONAMES_COUNTRY_REMAP[cc]
        out.append({
            'id': int(p['id']), 'name': p['name'], 'lat': float(p['lat']), 'lon': float(p['lon']),
            'cc': cc, 'a1': p['cc'] + '.' + p['a1'], 'a2': p['cc'] + '.' + p['a1'] + '.' + p['a2'],
            'pop': int(p['pop'] or 0), 'tz': p['tz'], 'fcode': p['fcode'], 'forced_state': forced,
            'source': 'geonames',
        })
    return out


def load_wikidata_cities(src, report):
    d = src.path('wikidata', 'cities')
    path = src.path('wikidata', 'not_a_town_types.csv')
    not_a_town = {qid(r['t']) for r in csv.DictReader(open(path, encoding='utf-8'))} if os.path.exists(path) else set()
    out = {}
    for f in sorted(os.listdir(d)):
        cc = f[:-4]
        forced = None
        if cc in config.FOLD_INTO:
            cc, forced = config.FOLD_INTO[cc]
        for r in csv.DictReader(open(os.path.join(d, f), encoding='utf-8')):
            q = qid(r['item'])
            types = {qid(t) for t in r['types'].split('|') if t}
            # dissolved, explicitly excluded, or only historical / non-settlement types
            if r['end'] or types & config.WD_EXCLUDED_TYPES or (types and types <= not_a_town):
                report['wikidata_excluded'] += 1
                continue
            pt = parse_point(r['coord'])
            label = r.get('label') or ''
            if not pt or not label or re.fullmatch(r'Q\d+', label):
                continue
            try:
                pop = int(float(r['pop'])) if r['pop'] else 0
            except ValueError:
                pop = 0
            gn = {int(r['gn'])} if r['gn'].isdigit() else set()
            prev = out.get((q, cc))
            if prev:  # several coordinates/populations per item: keep the first point, max population
                prev['pop'] = max(prev['pop'], pop)
                prev['gn'] |= gn
                continue
            out[(q, cc)] = {'q': q, 'name': label, 'lon': pt[0], 'lat': pt[1], 'cc': cc, 'pop': pop,
                            'gn': gn, 'forced_state': forced,
                            'wikipedia': bool(r.get('enwiki') or r.get('frwiki'))}
    return list(out.values())


ADMIN_UNIT_LABEL = re.compile(r'^(City|Municipality|Town|Borough) of |\b(Commune|District|County|Province|Region|Municipality|Prefecture|Department|'
                              r'Governorate|Subdistrict|Sub-district|Township of|Woreda|Tehsil|Taluk)\b')
TYPE_WORDS = re.compile(r'\b(County|District|City|Province|Prefecture|Banner|Municipality|Township|Town|Region|State)\b')


def clean_wikidata_label(label, cc, state_names):
    """'Hongqiao Town, Changxing County' -> 'Hongqiao'; 'Bar, Razavi Khorasan' -> 'Bar'."""
    if ', ' in label:
        head, tail = label.split(', ', 1)
        if TYPE_WORDS.search(tail) or norm(tail) in state_names or strip_suffixes(tail) in state_names:
            label = head
    if cc == 'CN':  # "Wenzhu Town, Yongxin" -> "Wenzhu": disambiguation + translated 镇 / 乡 suffix
        label = re.sub(r' (Town|Township|Ethnic Township)$', '', label.split(', ')[0])
    return label.strip()


def merge_wikidata(gn_cities, wd_cities, country_geoms, populations, state_names, report):
    """Add Wikidata cities/towns that GeoNames lacks.

    Any item Wikidata types as a city or town (or a subclass) qualifies, unless it records a
    population below config.WIKIDATA_MIN_POPULATION, records none in a country GeoNames already
    covers well, was dissolved or only has historical / non-settlement types, names an
    administrative unit, lies outside its country, is a suburb inside a big city, or duplicates
    a place we already have.
    """
    gn_ids = {c['id'] for c in gn_cities}
    by_cc = collections.defaultdict(list)
    for c in gn_cities:
        by_cc[c['cc']].append(c)
    thin = {cc for cc, pop in populations.items()
            if pop > 0 and len(by_cc.get(cc, [])) / (pop / 1e6) < config.THIN_COVERAGE_PER_MILLION}
    report['thin_coverage_countries'] = sorted(thin)
    # Cities of 300k+ and the radius (km) within which an unknown-size place is one of their suburbs.
    big = {}
    for cc, cs in by_cc.items():
        bc = [c for c in cs if c['pop'] >= 300000]
        if bc:
            big[cc] = (np.array([c['lon'] for c in bc]), np.array([c['lat'] for c in bc]),
                       np.array([0.006 * math.sqrt(c['pop']) for c in bc]))
    arrays = {cc: (np.array([c['lon'] for c in cs]), np.array([c['lat'] for c in cs]), [norm(c['name']) for c in cs])
              for cc, cs in by_cc.items()}
    added, seen_q = [], set()
    for w in wd_cities:
        if w['gn'] & gn_ids:
            report['wikidata_matched_by_geonames_id'] += 1
            continue
        if w['q'] in seen_q:
            continue
        if 0 < w['pop'] < config.WIKIDATA_MIN_POPULATION:
            report['wikidata_below_threshold'] += 1
            continue
        if w['pop'] == 0 and w['cc'] not in thin:
            # GeoNames already lists every 500+ place there: an unsized extra is a hamlet,
            # a historic site or part of another place.
            report['wikidata_unsized_in_well_covered_country'] += 1
            continue
        w['name'] = clean_wikidata_label(w['name'], w['cc'], state_names.get(w['cc'], set()))
        if ADMIN_UNIT_LABEL.search(w['name']):
            report['wikidata_admin_unit_labels'] += 1
            continue
        g = country_geoms.get(w['cc'])
        if g is not None and not geo.contains_point(g, w['lon'], w['lat'], tol_deg=0.15):
            report['wikidata_outside_country'] += 1
            continue
        n = norm(w['name'])
        dup = False
        if w['cc'] in arrays:
            lons, lats, names = arrays[w['cc']]
            dist = geo.haversine_km(w['lon'], w['lat'], lons, lats)
            for i in np.where(dist < 8)[0]:
                m = names[i]
                if dist[i] < 1.0 or m == n or n in m or m in n or difflib.SequenceMatcher(None, n, m).ratio() >= 0.8:
                    dup = True
                    break
        if dup:
            report['wikidata_matched_by_proximity'] += 1
            continue
        if w['pop'] == 0 and w['cc'] in big:
            blons, blats, radius = big[w['cc']]
            if np.any(geo.haversine_km(w['lon'], w['lat'], blons, blats) < radius):
                report['wikidata_suburbs_skipped'] += 1
                continue
        seen_q.add(w['q'])
        added.append({
            'id': -int(w['q'][1:]), 'name': w['name'], 'lat': w['lat'], 'lon': w['lon'], 'cc': w['cc'],
            'a1': None, 'a2': None, 'pop': w['pop'], 'tz': None, 'fcode': 'WD', 'forced_state': w['forced_state'],
            'source': 'wikidata',
        })
    # Wikidata items can duplicate each other (e.g. a town and its municipality); dedupe them.
    added.sort(key=lambda c: -c['pop'])
    kept, grid = [], collections.defaultdict(list)
    for c in added:
        n = norm(c['name'])
        clash = any(
            (o[0] == n or difflib.SequenceMatcher(None, o[0], n).ratio() >= 0.85)
            and geo.haversine_km(c['lon'], c['lat'], o[1], o[2]) < 8
            for dlat in (-0.1, 0, 0.1) for dlon in (-0.1, 0, 0.1)
            for o in grid[(c['cc'], round(c['lat'] + dlat, 1), round(c['lon'] + dlon, 1))]
        )
        if clash:
            report['wikidata_self_duplicates'] += 1
            continue
        grid[(c['cc'], round(c['lat'], 1), round(c['lon'], 1))].append((n, c['lon'], c['lat']))
        kept.append(c)
    report['wikidata_added'] = len(kept)
    return gn_cities + kept


def load_manual_additions(cities, report):
    """Places missing from the upstream sources, curated in cities.additions.json."""
    have = {c['id'] for c in cities}
    added = 0
    for e in json.load(open(os.path.join(HERE, 'cities.additions.json'), encoding='utf-8')):
        if e['id'] in have:
            continue
        cities.append({'id': e['id'], 'name': e['name'], 'lat': e['lat'], 'lon': e['lng'], 'cc': e['country'],
                       'a1': None, 'a2': None, 'pop': e.get('population', 0), 'tz': e.get('timezone'),
                       'fcode': 'MANUAL', 'forced_state': e.get('state'), 'source': 'manual'})
        added += 1
    report['manual_additions'] = added
    return cities


def dedupe_geonames(cities, report):
    """Drop GeoNames duplicates: same country + same normalised name within 3 km."""
    cities.sort(key=lambda c: (-c['pop'], c['fcode'] != 'PPLC', c['id']))
    grid = collections.defaultdict(list)
    out = []
    for c in cities:
        n = norm(c['name'])
        clash = any(
            o[0] == n and geo.haversine_km(c['lon'], c['lat'], o[1], o[2]) < 3
            for dlat in (-0.05, 0, 0.05) for dlon in (-0.05, 0, 0.05)
            for o in grid[(c['cc'], round((c['lat'] + dlat) * 20), round((c['lon'] + dlon) * 20))]
        )
        if clash:
            report['geonames_duplicates_removed'] += 1
            continue
        grid[(c['cc'], round(c['lat'] * 20), round(c['lon'] * 20))].append((n, c['lon'], c['lat']))
        out.append(c)
    return out


def map_admin_units(src, states, report):
    """GeoNames admin1 (and admin2 for flattened countries) code -> ISO 3166-2 state code.

    Primary join: the GeoNames id Wikidata stores on each ISO 3166-2 item (P1566). Fallback:
    name matching within the country.
    """
    by_country = collections.defaultdict(list)
    gn2state = {}
    for s in states:
        by_country[s['country']].append(s)
        for g in s['geonames']:
            gn2state.setdefault(g, s['code'])
    matchers = {cc: NameMatcher(sts) for cc, sts in by_country.items()}
    remap = {k: v[0] for k, v in list(config.FOLD_INTO.items()) + list(config.GEONAMES_COUNTRY_REMAP.items())}
    out, how = {}, collections.Counter()
    for fname, level in (('admin1CodesASCII.txt', 1), ('admin2Codes.txt', 2)):
        for row in src.geonames_admin(fname):
            gcc = row['code'].split('.')[0]
            if gcc in remap:
                continue
            if level == 2 and gcc not in config.FLATTEN_TOP_LEVEL:
                continue
            if gcc not in by_country:
                continue
            st = gn2state.get(row['gn'])
            if st and st.startswith(gcc + '-'):
                out[row['code']] = st
                how['level%d-by-geonames-id' % level] += 1
                continue
            st = matchers[gcc].match(row['name'], row['ascii'])
            if st:
                out[row['code']] = st
                how['level%d-by-name' % level] += 1
            else:
                how['level%d-unmatched' % level] += 1
    report['admin_mapping'] = dict(how)
    return out


def assign_states(cities, states, state_geoms, admin_map, poly_source, report):
    """Assign every city to an ISO 3166-2 state.

    Two independent signals are reconciled: the GeoNames admin hierarchy (mapped to ISO codes)
    and point-in-polygon against the state polygons.
      1. Polygons whose code is swapped with another unit (polygon X full of Y-cities while
         polygon Y is full of others) are relabelled.
      2. GeoNames admin units whose cities fall >= 70% inside one other state's polygon are
         remapped (only when the mapped state has a polygon of its own to contradict it).
      3. Per city, the admin label wins unless the city lies clearly outside that state's
         polygon (3 km for geoBoundaries, 10 km for the coarser Natural Earth shapes); that
         catches places moved across a boundary after GeoNames was last updated.
    """
    has_states = {s['country'] for s in states}

    def build_trees():
        by_country = collections.defaultdict(list)
        for s in states:
            if s['code'] in state_geoms:
                by_country[s['country']].append(s['code'])
        return {cc: (STRtree([state_geoms[k] for k in codes]), codes, [state_geoms[k] for k in codes])
                for cc, codes in by_country.items()}

    def pip(trees, c):
        t = trees.get(c['cc'])
        if not t:
            return None, None
        tree, codes, gs = t
        pt = Point(c['lon'], c['lat'])
        hits = tree.query(pt, predicate='intersects')
        if len(hits):
            return codes[hits[0]], 0.0
        i = tree.nearest(pt)
        return codes[i], km_to(gs[i], c['lon'], c['lat'])

    def admin_label(c):
        return (admin_map.get(c['a2']) if c['a2'] else None) or (admin_map.get(c['a1']) if c['a1'] else None)

    todo = [c for c in cities if not c['forced_state'] and c['cc'] in has_states]
    trees = build_trees()
    for c in todo:
        c['pip'], c['pip_km'] = pip(trees, c)

    # 1. swapped polygon codes
    inside = collections.defaultdict(collections.Counter)
    for c in todo:
        lab = admin_label(c)
        if lab and c['pip_km'] == 0.0:
            inside[c['pip']][lab] += 1
    majority, support = {}, {}
    for code, cnt in inside.items():
        lab, n = cnt.most_common(1)[0]
        if n / sum(cnt.values()) >= 0.6:
            majority[code], support[code] = lab, sum(cnt.values())
    bad = {x for x, m in majority.items() if m != x}
    relabel = {}
    for x in bad:
        y = majority[x]
        mutual = majority.get(y) == x  # X and Y swapped: strong evidence even with few cities
        if (support[x] >= 3 and y in bad) or mutual:
            relabel[x] = y
    if len(set(relabel.values())) != len(relabel):  # ambiguous: two polygons claiming one unit
        relabel = {}
    if relabel:
        geoms = {x: state_geoms[x] for x in relabel}
        for x in relabel:
            del state_geoms[x]
        for x, y in relabel.items():
            state_geoms[y] = geoms[x]
        trees = build_trees()
        for c in todo:
            c['pip'], c['pip_km'] = pip(trees, c)
    report['polygon_relabels'].update(relabel)

    # Polygon health: the share of a state's GeoNames-labelled places that its polygon contains.
    # Healthy polygons are trustworthy evidence; outdated or misplaced ones are not.
    labelled, contained = collections.Counter(), collections.Counter()
    unit_lab, unit_in = collections.Counter(), collections.Counter()
    unit_pip = collections.defaultdict(collections.Counter)
    for c in todo:
        lab = admin_label(c)
        if not lab or lab not in state_geoms:
            continue
        key = c['a2'] if c['a2'] in admin_map else c['a1']
        hit = c['pip'] == lab and c['pip_km'] == 0.0
        labelled[lab] += 1
        contained[lab] += hit
        unit_lab[(key, lab)] += 1
        unit_in[(key, lab)] += hit
        if c['pip_km'] == 0.0:
            unit_pip[key][c['pip']] += 1

    def health(st, minus=None):
        n, k = labelled[st], contained[st]
        if minus:
            n, k = n - unit_lab[(minus, st)], k - unit_in[(minus, st)]
        return k / n if n > 0 else None

    # 2. wrongly mapped admin units: the mapped polygon is healthy for its other places but holds
    #    none of this unit's, while a healthy neighbour holds most of them.
    remaps = {}
    for key, cnt in unit_pip.items():
        mapped = admin_map.get(key)
        if mapped not in state_geoms:
            continue
        top, n = cnt.most_common(1)[0]
        total = sum(cnt.values())
        h_mapped, h_top = health(mapped, minus=key), health(top)
        if (top != mapped and total >= 3 and n / total >= 0.7 and cnt[mapped] / total <= 0.1
                and h_mapped is not None and h_mapped >= 0.8 and h_top is not None and h_top >= 0.8):
            remaps[key] = (mapped, top)
            admin_map[key] = top
    report['admin_unit_remaps'].update(remaps)

    # 3. per city. Measured against Wikidata P131 chains, a polygon contradicting the GeoNames
    #    label is right ~90% of the time when both polygons are healthy, and mostly wrong otherwise.
    complete = {cc for cc, v in poly_source.items() if not v.get('missing')}
    n_states = collections.Counter(s['country'] for s in states)
    # Polygons are only used on their own where most of the country's states have one.
    usable = {cc for cc, v in poly_source.items() if len(v.get('missing', [])) < 0.5 * n_states[cc]}
    stats = collections.Counter()
    overrides = collections.Counter()
    for c in cities:
        c['how'] = None
        if c['forced_state']:
            c['state'], c['how'] = c['forced_state'], 'forced'
        elif c['cc'] not in has_states:
            c['state'], c['how'] = None, 'country-without-states'
        else:
            lab = admin_label(c)
            if lab:
                c['state'], c['how'] = lab, 'admin'
                if c['pip'] and c['pip'] != lab and c['pip_km'] == 0.0 and lab in state_geoms:
                    limit = 3.0 if poly_source.get(c['cc'], {}).get('source') == 'geoboundaries' else 10.0
                    h_lab, h_pip = health(lab), health(c['pip'])
                    if (km_to(state_geoms[lab], c['lon'], c['lat']) > limit and h_lab is not None and h_lab >= 0.9
                            and h_pip is not None and h_pip >= 0.75):
                        overrides[c['cc']] += 1
                        c['admin_state'] = lab
                        c['state'], c['how'] = c['pip'], 'polygon-override'
            elif c['pip'] and c['pip_km'] == 0.0 and c['cc'] in usable:
                c['state'], c['how'] = c['pip'], 'polygon'
            elif c['pip'] and c['cc'] in complete and c['pip_km'] <= 50:
                c['state'], c['how'] = c['pip'], 'nearest'
            else:
                c['state'], c['how'] = None, 'unknown'
        stats[c['how']] += 1
    report['city_state_assignment'] = dict(stats)
    report['polygon_overrides_by_country'] = dict(overrides)


def assign_timezones(cities, report):
    by_cc = collections.defaultdict(list)
    for c in cities:
        if c['tz']:
            by_cc[c['cc']].append(c)
    arr = {cc: (np.array([c['lon'] for c in cs]), np.array([c['lat'] for c in cs]), [c['tz'] for c in cs])
           for cc, cs in by_cc.items()}
    n = 0
    for c in cities:
        if c['tz'] or c['cc'] not in arr:
            continue
        lons, lats, tzs = arr[c['cc']]
        c['tz'] = tzs[int(np.argmin(geo.haversine_km(c['lon'], c['lat'], lons, lats)))]
        n += 1
    report['timezone_from_nearest_city'] = n


# --------------------------------------------------------------------------- timezones

def zone_tab():
    """zone.tab as {country: [zones]} plus [(country, zone, lon, lat)] reference points."""
    out = collections.defaultdict(list)
    points = []
    for line in open('/usr/share/zoneinfo/zone.tab', encoding='utf-8'):
        if line.startswith('#') or not line.strip():
            continue
        p = line.split('\t')
        out[p[0]].append(p[2].strip())
        m = re.match(r'([+-])(\d{2})(\d{2})(\d{2})?([+-])(\d{3})(\d{2})(\d{2})?$', p[1])
        if m:
            lat = (int(m.group(2)) + int(m.group(3)) / 60 + int(m.group(4) or 0) / 3600) * (1 if m.group(1) == '+' else -1)
            lon = (int(m.group(6)) + int(m.group(7)) / 60 + int(m.group(8) or 0) / 3600) * (1 if m.group(5) == '+' else -1)
            points.append((p[0], p[2].strip(), lon, lat))
    return out, points


def build_timezones(countries, states, cities, continents, report):
    import zoneinfo
    valid = zoneinfo.available_timezones()
    zt, zone_points = zone_tab()
    fold_src = collections.defaultdict(list)
    for src_cc, (host, _code) in config.FOLD_INTO.items():
        fold_src[host].append(src_cc)
    for src_cc, (host, _code) in config.FOLD_INTO.items():
        zt[host].extend(z for z in zt.get(src_cc, []) if z not in zt[host])
    pop_tz = collections.defaultdict(collections.Counter)
    state_tz = collections.defaultdict(collections.Counter)
    for c in cities:
        w = max(c['pop'], 1)
        pop_tz[c['cc']][c['tz']] += w
        if c.get('state'):
            state_tz[c['state']][c['tz']] += w
    report['invalid_timezones'] = sorted({c['tz'] for c in cities if c['tz'] not in valid})
    for c in countries:
        ordered = [z for z, _ in pop_tz[c['iso2']].most_common()]
        ordered += [z for z in zt.get(c['iso2'], []) if z not in ordered]
        c['timezones'] = [z for z in ordered if z in valid]
    for s in states:
        tzs = [z for z, _ in state_tz[s['code']].most_common() if z in valid]
        if not tzs:
            # No cities: the zone whose reference location (zone.tab) is nearest, preferring the
            # country's own zones unless they are far away (remote islands such as Wake).
            own = [z for z in zone_points if z[0] == s['country'] or z[0] in fold_src.get(s['country'], ())]
            pick = None
            for pool in (own, zone_points):
                if not pool:
                    continue
                d = geo.haversine_km(s['lon'], s['lat'], np.array([z[2] for z in pool]), np.array([z[3] for z in pool]))
                i = int(np.argmin(d))
                if pool is zone_points or d[i] < 1500:
                    pick = pool[i][1]
                    break
            tzs = [pick]
        s['timezones'] = tzs
    for cont in continents:
        zs = []
        for c in countries:
            if c['continent'] == cont['code']:
                zs.extend(z for z in c['timezones'] if z not in zs)
        cont['timezones'] = sorted(zs)


# --------------------------------------------------------------------------- i18n

def cldr_country_names(codes):
    """Country names from CLDR via Node's Intl.DisplayNames (full-icu)."""
    import subprocess
    script = ('const codes=%s, langs=%s; const out={};'
              'for (const l of langs){ const dn=new Intl.DisplayNames([l],{type:"region",fallback:"none"}); out[l]={};'
              ' for (const c of codes){ const n=dn.of(c); if(n) out[l][c]=n; } }'
              'process.stdout.write(JSON.stringify(out));') % (json.dumps(codes), json.dumps(config.LANGS))
    return json.loads(subprocess.check_output(['node', '-e', script]))


def city_translations(src, cities, report):
    ids = {c['id'] for c in cities if c['id'] > 0}
    want = set(config.LANGS) - {'en'}
    alias = {'zh-CN': 'zh', 'zh-Hans': 'zh', 'pt-BR': 'pt', 'pt-PT': 'pt'}
    best = {}
    with zipfile.ZipFile(src.path('geonames', 'alternateNamesV2.zip')) as zf:
        with zf.open('alternateNamesV2.txt') as fh:
            for raw in io.TextIOWrapper(fh, encoding='utf-8'):
                p = raw.rstrip('\n').split('\t')
                if len(p) < 8:
                    continue
                lang = alias.get(p[2], p[2])
                if lang not in want:
                    continue
                gid = int(p[1])
                if gid not in ids or p[6] == '1' or p[7] == '1':  # colloquial / historic
                    continue
                score = (p[4] == '1', p[2] == lang, p[5] != '1')  # preferred, exact code, not short
                k = (gid, lang)
                if k not in best or score > best[k][0]:
                    best[k] = (score, p[3])
    english = {c['id']: c['name'] for c in cities}
    out = collections.defaultdict(dict)
    for (gid, lang), (_, name) in best.items():
        if name and name != english[gid]:
            out[lang][gid] = name
    d = src.path('wikidata', 'city_labels')
    wd = {-c['id']: c for c in cities if c['id'] < 0}
    if os.path.isdir(d):
        for f in os.listdir(d):
            for r in csv.DictReader(open(os.path.join(d, f), encoding='utf-8')):
                q = int(qid(r['item'])[1:])
                if q in wd and r['lang'] in want and r['l'] != wd[q]['name']:
                    out[r['lang']][-q] = r['l']
    report['city_translations'] = {lang: len(v) for lang, v in out.items()}
    return out


# --------------------------------------------------------------------------- output

def write_json(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, separators=(',', ':'))


def delta(values):
    out, prev = [], 0
    for v in values:
        out.append(v - prev)
        prev = v
    return out


def rle(values):
    out = []
    for v in values:
        if out and out[-2] == v:
            out[-1] += 1
        else:
            out.extend([v, 1])
    return out


def emit(out_dir, continents, countries, states, cities, tz_list, i18n_core, i18n_cities, report):
    import shutil
    shutil.rmtree(out_dir, ignore_errors=True)
    tz_index = {z: i for i, z in enumerate(tz_list)}
    q = 10 ** config.PRECISION

    def tzs(zs):
        return [tz_index[z] for z in zs]

    write_json(os.path.join(out_dir, 'timezones.json'), tz_list)
    write_json(os.path.join(out_dir, 'continents.json'), [
        [c['code'], c['iso3'], c['names']['en'], rnd(c['lat']), rnd(c['lon']), tzs(c['timezones'])] for c in continents])
    cont_idx = {c['code']: i for i, c in enumerate(continents)}
    write_json(os.path.join(out_dir, 'countries.json'), [
        [c['iso2'], c['iso3'], c['numeric'], c['name'], cont_idx[c['continent']], c['phone'] or '',
         rnd(c['lat']), rnd(c['lon']), tzs(c['timezones'])] for c in countries])
    country_idx = {c['iso2']: i for i, c in enumerate(countries)}
    types = sorted({s['type'] for s in states})
    type_idx = {t: i for i, t in enumerate(types)}
    write_json(os.path.join(out_dir, 'states.json'), {
        'types': types,
        'states': [[country_idx[s['country']], s['code'].split('-', 1)[1], s['name'], type_idx[s['type']],
                    rnd(s['lat']), rnd(s['lon']), tzs(s['timezones'])] for s in states],
    })

    by_cc = collections.defaultdict(list)
    for c in cities:
        by_cc[c['cc']].append(c)
    state_order = collections.defaultdict(list)
    for s in states:
        state_order[s['country']].append(s['code'])
    sizes = {}
    city_tr = collections.defaultdict(list)
    for cc, cs in by_cc.items():
        local = {code: i for i, code in enumerate(state_order.get(cc, []))}
        cs.sort(key=lambda c: (local.get(c['state'], -1), norm(c['name']), c['id']))
        used_states = sorted({local[c['state']] for c in cs if c['state'] in local})
        remap = {old: new for new, old in enumerate(used_states)}
        codes = state_order.get(cc, [])
        lat = [round(c['lat'] * q) for c in cs]
        lon = [round(c['lon'] * q) for c in cs]
        doc = {
            'c': [codes[i].split('-', 1)[1] for i in used_states],
            'i': [c['id'] for c in cs],
            'n': [c['name'] for c in cs],
            's': rle([remap.get(local.get(c['state'], -1), -1) for c in cs]),
            'y': delta(lat),
            'x': delta(lon),
            'z': rle([tz_index[c['tz']] for c in cs]),
        }
        path = os.path.join(out_dir, 'cities', cc + '.json')
        write_json(path, doc)
        sizes[cc] = os.path.getsize(path)
        for lang, names in i18n_cities.items():
            idx = [i for i, c in enumerate(cs) if c['id'] in names]
            if idx:
                write_json(os.path.join(out_dir, 'i18n', lang, 'cities', cc + '.json'),
                           [idx, [names[cs[i]['id']] for i in idx]])
                city_tr[lang].append(cc)
    for lang, doc in i18n_core.items():
        write_json(os.path.join(out_dir, 'i18n', lang, 'core.json'), doc)
    write_json(os.path.join(out_dir, 'index.json'), {
        'cities': sorted(by_cc), 'languages': config.LANGS,
        'cityTranslations': {lang: sorted(v) for lang, v in sorted(city_tr.items())},
    })
    report['city_file_bytes'] = sizes


# --------------------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--cache', default=os.path.join(HERE, '.cache'))
    ap.add_argument('--out', default=os.path.join(PKG, 'src', 'data'))
    ap.add_argument('--report', default=os.path.join(HERE, 'build-report.json'))
    ap.add_argument('--rebuild-geoms', action='store_true', help='ignore the cached polygon tables')
    args = ap.parse_args()
    src = Sources(os.path.abspath(args.cache))
    report = collections.defaultdict(collections.Counter)
    report.update({'dissolved_removed': [], 'state_polygon_source': {}, 'centre_method': {}, 'polygon_code_name_conflicts': [],
                   'polygon_relabels': {}, 'admin_unit_remaps': {},
                   'excluded_feature_codes': collections.Counter(), 'wikidata_excluded': 0,
                   'wikidata_matched_by_geonames_id': 0, 'wikidata_outside_country': 0,
                   'wikidata_matched_by_proximity': 0, 'wikidata_self_duplicates': 0, 'wikidata_below_threshold': 0,
                   'wikidata_country_well_covered': 0, 'wikidata_admin_unit_labels': 0,
                   'wikidata_suburbs_skipped': 0, 'wikidata_unsized_in_well_covered_country': 0,
                   'geonames_duplicates_removed': 0})

    log('countries / states')
    countries = load_countries()
    wd_items, wd_labels = src.wikidata_iso2()
    states, by_code, successor = build_states(countries, wd_items, wd_labels, report)
    log('  %d countries, %d states' % (len(countries), len(states)))

    geom_cache = os.path.join(src.cache, 'geoms.pickle')
    if os.path.exists(geom_cache) and not args.rebuild_geoms:
        country_geoms, adm0, state_geoms, leftovers, poly_report, conflicts = pickle.load(open(geom_cache, 'rb'))
        report['state_polygon_source'], report['polygon_code_name_conflicts'] = poly_report, conflicts
    else:
        log('polygons')
        country_geoms, adm0 = build_country_geoms(src)
        state_geoms, leftovers = build_state_geoms(src, countries, states, by_code, successor, country_geoms, adm0, report)
        pickle.dump((country_geoms, adm0, state_geoms, leftovers, report['state_polygon_source'],
                     report['polygon_code_name_conflicts']), open(geom_cache, 'wb'))
    state_geoms = dict(state_geoms)

    log('cities')
    cities = load_geonames_cities(src, report)
    cities = dedupe_geonames(cities, report)
    cities = load_manual_additions(cities, report)
    state_names = collections.defaultdict(set)
    for s in states:
        state_names[s['country']].update({norm(s['name']), strip_suffixes(s['name']), norm(s['iso_name'])})
    cities = merge_wikidata(cities, load_wikidata_cities(src, report), country_geoms, src.country_populations(),
                            state_names, report)
    known = {c['iso2'] for c in countries}
    report['cities_unknown_country'] = collections.Counter(c['cc'] for c in cities if c['cc'] not in known)
    cities = [c for c in cities if c['cc'] in known]
    admin_map = map_admin_units(src, states, report)
    poly_source = report['state_polygon_source']
    assign_states(cities, states, state_geoms, admin_map, poly_source, report)
    refined = refine_split_states(states, cities, state_geoms, leftovers, report)
    if refined:  # redo the assignment with the refined polygons (relabels are already applied)
        assign_states(cities, states, state_geoms, admin_map, poly_source, report)
    assign_timezones(cities, report)
    cities = [c for c in cities if c['tz']]
    log('  %d cities' % len(cities))

    log('centres')
    compute_country_centres(countries, country_geoms, src.wikidata_country_coords(), report)
    compute_state_centres(states, state_geoms, refined, cities, countries, report)
    cc_centres = continent_centres(countries, states)
    continents = []
    for code, iso3, m49, names in config.CONTINENTS:
        lon, lat = cc_centres[code]
        continents.append({'code': code, 'iso3': iso3, 'm49': m49, 'names': names, 'lon': lon, 'lat': lat})

    log('time zones')
    build_timezones(countries, states, cities, continents, report)
    used = set()
    for x in continents + countries + states:
        used.update(x['timezones'])
    used.update(c['tz'] for c in cities)
    tz_list = sorted(used)

    log('translations')
    cldr = cldr_country_names([c['iso2'] for c in countries])
    i18n_core = {}
    for lang in config.LANGS:
        if lang == 'en':
            continue
        doc = {'continents': {}, 'countries': {}, 'states': {}}
        for c in continents:
            if c['names'].get(lang) and c['names'][lang] != c['names']['en']:
                doc['continents'][c['code']] = c['names'][lang]
        for c in countries:
            n = cldr.get(lang, {}).get(c['iso2'])
            if n and n != c['name']:
                doc['countries'][c['iso2']] = n
        for s in states:
            n = s['labels'].get(lang)
            if n and n != s['name']:
                doc['states'][s['code']] = n
        i18n_core[lang] = doc
    i18n_cities = city_translations(src, cities, report)

    log('writing')
    emit(os.path.abspath(args.out), continents, countries, states, cities, tz_list, i18n_core, i18n_cities, report)

    report['totals'] = {'continents': len(continents), 'countries': len(countries), 'states': len(states),
                        'cities': len(cities), 'timezones': len(tz_list),
                        'cities_by_source': collections.Counter(c['source'] for c in cities)}
    snapshot = {
        'continents': continents,
        'countries': countries,
        'states': [{k: v for k, v in s.items() if k != 'labels'} for s in states],
    }
    write_json(os.path.join(src.cache, 'snapshot.json'), snapshot)
    pickle.dump({'cities': cities, 'state_geoms': state_geoms, 'country_geoms': country_geoms},
                open(os.path.join(src.cache, 'audit-input.pickle'), 'wb'))
    with open(args.report, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=1, sort_keys=True,
                  default=lambda o: dict(o) if isinstance(o, collections.Counter) else str(o))
    log('done', json.dumps(report['totals']))


if __name__ == '__main__':
    main()
