"""Accuracy audit of the shipped dataset.

Usage: python3 -I audit.py [--cache DIR] [--out ../../AUDIT.md]

Decodes the published data (src/data) independently of the TypeScript library and checks it
against the standards it claims to follow and against independent references:

  - ISO 3166-1 / ISO 3166-2 (pycountry, Debian iso-codes), IANA tz database (zoneinfo, zone.tab)
  - Natural Earth label points and Wikidata coordinates for countries and states
  - Wikidata coordinates and "located in" (P131) chains for a stratified sample of cities
  - hand-verified known answers for city -> state and city -> time zone
  - the previous release (legacy/data.json) for a before/after comparison
"""
import argparse
import collections
import csv
import gzip
import json
import math
import os
import pickle
import random
import re
import subprocess
import sys
import unicodedata
import urllib.parse
import urllib.request
import zoneinfo
from datetime import datetime, timezone

import numpy as np
import pycountry
import shapely
from shapely.geometry import Point

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config  # noqa: E402
import geo  # noqa: E402
from fetch import QLEVER, QLEVER_PREFIXES, SSL_CTX, UA  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(os.path.dirname(HERE))
DATA = os.path.join(PKG, 'src', 'data')


def load(name):
    return json.load(open(os.path.join(DATA, name), encoding='utf-8'))


def pct(a, b):
    return '%.2f%%' % (100.0 * a / b) if b else 'n/a'


def km(lon1, lat1, lon2, lat2):
    return float(geo.haversine_km(lon1, lat1, lon2, lat2))


def stats(values):
    if not values:
        return {'n': 0}
    a = np.array(values)
    return {'n': len(a), 'median': round(float(np.median(a)), 2), 'p90': round(float(np.percentile(a, 90)), 2),
            'p95': round(float(np.percentile(a, 95)), 2), 'max': round(float(a.max()), 2)}


def norm(s):
    s = unicodedata.normalize('NFKD', s or '')
    s = ''.join(ch for ch in s if not unicodedata.combining(ch))
    return re.sub(r'[^a-z0-9]+', ' ', s.lower()).strip()


# --------------------------------------------------------------------------- decode published data

def decode():
    tz = load('timezones.json')
    continents = [{'iso': r[0], 'iso3': r[1], 'name': r[2], 'lat': r[3], 'lng': r[4], 'tz': [tz[i] for i in r[5]]}
                  for r in load('continents.json')]
    countries = [{'iso': r[0], 'iso3': r[1], 'numeric': r[2], 'name': r[3], 'continent': continents[r[4]]['iso'],
                  'phone': r[5], 'lat': r[6], 'lng': r[7], 'tz': [tz[i] for i in r[8]]} for r in load('countries.json')]
    sd = load('states.json')
    states = [{'iso': '%s-%s' % (countries[r[0]]['iso'], r[1]), 'country': countries[r[0]]['iso'], 'name': r[2],
               'type': sd['types'][r[3]], 'lat': r[4], 'lng': r[5], 'tz': [tz[i] for i in r[6]]} for r in sd['states']]
    cities = []
    for c in countries:
        path = os.path.join(DATA, 'cities', c['iso'] + '.json')
        if not os.path.exists(path):
            continue
        f = json.load(open(path, encoding='utf-8'))
        st = []
        for i in range(0, len(f['s']), 2):
            st += [f['s'][i]] * f['s'][i + 1]
        zs = []
        for i in range(0, len(f['z']), 2):
            zs += [f['z'][i]] * f['z'][i + 1]
        lat = np.cumsum(f['y']) / 10 ** config.PRECISION
        lng = np.cumsum(f['x']) / 10 ** config.PRECISION
        for k in range(len(f['i'])):
            cities.append({'id': f['i'][k], 'name': f['n'][k], 'country': c['iso'],
                           'state': None if st[k] < 0 else '%s-%s' % (c['iso'], f['c'][st[k]]),
                           'lat': float(lat[k]), 'lng': float(lng[k]), 'tz': tz[zs[k]]})
    return continents, countries, states, cities, tz


# --------------------------------------------------------------------------- wikidata sample check

def sparql(query, dest):
    if os.path.exists(dest):
        return list(csv.DictReader(open(dest, encoding='utf-8')))
    body = urllib.parse.urlencode({'query': QLEVER_PREFIXES + query}).encode()
    req = urllib.request.Request(QLEVER, data=body, headers={
        'User-Agent': UA, 'Accept': 'text/csv', 'Content-Type': 'application/x-www-form-urlencoded'})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=300, context=SSL_CTX) as r:
                data = r.read()
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            open(dest, 'wb').write(data)
            return list(csv.DictReader(open(dest, encoding='utf-8')))
        except Exception as e:  # noqa: BLE001
            print('  sparql retry', attempt + 1, e, file=sys.stderr)
    return None


def wikidata_links(cache):
    """GeoNames id -> (Wikidata item, coordinate) from the cached Wikidata city queries."""
    out = {}
    d = os.path.join(cache, 'wikidata', 'cities')
    for f in os.listdir(d):
        for r in csv.DictReader(open(os.path.join(d, f), encoding='utf-8')):
            m = re.match(r'Point\(([-\d.eE]+) ([-\d.eE]+)\)', r['coord'] or '', re.I)
            if r['gn'].isdigit() and m:
                out.setdefault(int(r['gn']), (r['item'].rsplit('/', 1)[-1], float(m.group(1)), float(m.group(2))))
    return out


def top_level(code, state_codes):
    seen = 0
    while code and code not in state_codes and seen < 6:
        s = pycountry.subdivisions.get(code=code)
        code = s.parent_code if s else None
        seen += 1
    return code if code in state_codes else None


# --------------------------------------------------------------------------- known answers

KNOWN_STATE = [
    ('Accra', 'GH', 'GH-AA'), ('Kumasi', 'GH', 'GH-AH'), ('Tamale', 'GH', 'GH-NP'), ('Ho', 'GH', 'GH-TV'),
    ('Bolgatanga', 'GH', 'GH-UE'), ('Wa', 'GH', 'GH-UW'), ('Sunyani', 'GH', 'GH-BO'), ('Techiman', 'GH', 'GH-BE'),
    ('Cape Coast', 'GH', 'GH-CP'), ('Koforidua', 'GH', 'GH-EP'), ('Damongo', 'GH', 'GH-SV'), ('Dambai', 'GH', 'GH-OT'),
    ('Sefwi Wiawso', 'GH', 'GH-WN'), ('Lagos', 'NG', 'NG-LA'), ('Kano', 'NG', 'NG-KN'), ('Abuja', 'NG', 'NG-FC'),
    ('Port Harcourt', 'NG', 'NG-RI'), ('Ibadan', 'NG', 'NG-OY'), ('Nairobi', 'KE', 'KE-30'), ('Mombasa', 'KE', 'KE-28'),
    ('Kisumu', 'KE', 'KE-17'), ('Lyon', 'FR', 'FR-ARA'), ('Marseille', 'FR', 'FR-PAC'), ('Toulouse', 'FR', 'FR-OCC'),
    ('Strasbourg', 'FR', 'FR-GES'), ('Paris', 'FR', 'FR-IDF'), ('Ajaccio', 'FR', 'FR-20R'), ('Rennes', 'FR', 'FR-BRE'),
    ('Lille', 'FR', 'FR-HDF'), ('Bordeaux', 'FR', 'FR-NAQ'), ('Munich', 'DE', 'DE-BY'), ('Hamburg', 'DE', 'DE-HH'),
    ('Köln', 'DE', 'DE-NW'), ('Frankfurt am Main', 'DE', 'DE-HE'), ('Dresden', 'DE', 'DE-SN'),
    ('Mumbai', 'IN', 'IN-MH'), ('Bengaluru', 'IN', 'IN-KA'), ('Chennai', 'IN', 'IN-TN'), ('Kolkata', 'IN', 'IN-WB'),
    ('Hyderabad', 'IN', 'IN-TS'), ('New Delhi', 'IN', 'IN-DL'), ('São Paulo', 'BR', 'BR-SP'),
    ('Rio de Janeiro', 'BR', 'BR-RJ'), ('Salvador', 'BR', 'BR-BA'), ('Manaus', 'BR', 'BR-AM'),
    ('Los Angeles', 'US', 'US-CA'), ('Chicago', 'US', 'US-IL'), ('Houston', 'US', 'US-TX'), ('Phoenix', 'US', 'US-AZ'),
    ('Seattle', 'US', 'US-WA'), ('Miami', 'US', 'US-FL'), ('Washington', 'US', 'US-DC'), ('Toronto', 'CA', 'CA-ON'),
    ('Vancouver', 'CA', 'CA-BC'), ('Montréal', 'CA', 'CA-QC'), ('Calgary', 'CA', 'CA-AB'), ('Sydney', 'AU', 'AU-NSW'),
    ('Melbourne', 'AU', 'AU-VIC'), ('Perth', 'AU', 'AU-WA'), ('Brisbane', 'AU', 'AU-QLD'), ('Darwin', 'AU', 'AU-NT'),
    ('Canberra', 'AU', 'AU-ACT'), ('Hobart', 'AU', 'AU-TAS'), ('Adelaide', 'AU', 'AU-SA'), ('Shanghai', 'CN', 'CN-SH'),
    ('Guangzhou', 'CN', 'CN-GD'), ('Chengdu', 'CN', 'CN-SC'), ('Lhasa', 'CN', 'CN-XZ'), ('Taipei', 'CN', 'CN-TW'),
    ('Hong Kong', 'CN', 'CN-HK'), ('Osaka', 'JP', 'JP-27'), ('Sapporo', 'JP', 'JP-01'), ('Fukuoka', 'JP', 'JP-40'),
    ('Naha', 'JP', 'JP-47'), ('Moscow', 'RU', 'RU-MOW'), ('Saint Petersburg', 'RU', 'RU-SPE'),
    ('Novosibirsk', 'RU', 'RU-NVS'), ('Vladivostok', 'RU', 'RU-PRI'), ('Kazan', 'RU', 'RU-TA'),
    ('Johannesburg', 'ZA', 'ZA-GP'), ('Cape Town', 'ZA', 'ZA-WC'), ('Durban', 'ZA', 'ZA-KZN'), ('Cairo', 'EG', 'EG-C'),
    ('Alexandria', 'EG', 'EG-ALX'), ('Ho Chi Minh City', 'VN', 'VN-SG'), ('Hanoi', 'VN', 'VN-HN'),
    ('Da Nang', 'VN', 'VN-DN'), ('Mexico City', 'MX', 'MX-CMX'), ('Guadalajara', 'MX', 'MX-JAL'),
    ('Monterrey', 'MX', 'MX-NLE'), ('Tijuana', 'MX', 'MX-BCN'), ('Buenos Aires', 'AR', 'AR-C'),
    ('Córdoba', 'AR', 'AR-X'), ('Rosario', 'AR', 'AR-S'), ('Mendoza', 'AR', 'AR-M'), ('Madrid', 'ES', 'ES-MD'),
    ('Barcelona', 'ES', 'ES-CT'), ('Sevilla', 'ES', 'ES-AN'), ('Bilbao', 'ES', 'ES-PV'), ('Milan', 'IT', 'IT-25'),
    ('Rome', 'IT', 'IT-62'), ('Naples', 'IT', 'IT-72'), ('Turin', 'IT', 'IT-21'), ('Palermo', 'IT', 'IT-82'),
    ('Manchester', 'GB', 'GB-ENG'), ('Edinburgh', 'GB', 'GB-SCT'), ('Cardiff', 'GB', 'GB-WLS'),
    ('Belfast', 'GB', 'GB-NIR'), ('Oslo', 'NO', 'NO-03'), ('Bergen', 'NO', 'NO-46'), ('Tromsø', 'NO', 'NO-55'),
    ('Fredrikstad', 'NO', 'NO-31'), ('Drammen', 'NO', 'NO-33'), ('Tønsberg', 'NO', 'NO-39'), ('Skien', 'NO', 'NO-40'),
    ('Alta', 'NO', 'NO-56'), ('Jakarta', 'ID', 'ID-JK'), ('Surabaya', 'ID', 'ID-JI'), ('Medan', 'ID', 'ID-SU'),
    ('Makassar', 'ID', 'ID-SN'), ('Jayapura', 'ID', 'ID-PA'), ('Merauke', 'ID', 'ID-PS'), ('Sorong', 'ID', 'ID-PD'),
    ('Tamanghasset', 'DZ', 'DZ-11'), ('In Salah', 'DZ', 'DZ-53'), ('Touggourt', 'DZ', 'DZ-55'),
    ('Djanet', 'DZ', 'DZ-56'), ('Timimoun', 'DZ', 'DZ-49'),
]

KNOWN_TZ = [
    ('Phoenix', 'US', 'America/Phoenix'), ('Indianapolis', 'US', 'America/Indiana/Indianapolis'),
    ('El Paso', 'US', 'America/Denver'), ('Honolulu', 'US', 'Pacific/Honolulu'), ('Anchorage', 'US', 'America/Anchorage'),
    ('Detroit', 'US', 'America/Detroit'), ('Louisville', 'US', 'America/Kentucky/Louisville'),
    ('Boise', 'US', 'America/Boise'), ('Perth', 'AU', 'Australia/Perth'), ('Broken Hill', 'AU', 'Australia/Broken_Hill'),
    ('Adelaide', 'AU', 'Australia/Adelaide'), ('Lhasa', 'CN', 'Asia/Shanghai'), ('Vladivostok', 'RU', 'Asia/Vladivostok'),
    ('Kaliningrad', 'RU', 'Europe/Kaliningrad'), ('Yekaterinburg', 'RU', 'Asia/Yekaterinburg'),
    ('Novosibirsk', 'RU', 'Asia/Novosibirsk'), ('Accra', 'GH', 'Africa/Accra'), ('Mumbai', 'IN', 'Asia/Kolkata'),
    ('Kathmandu', 'NP', 'Asia/Kathmandu'), ("St. John's", 'CA', 'America/St_Johns'), ('Lagos', 'NG', 'Africa/Lagos'),
    ('Kinshasa', 'CD', 'Africa/Kinshasa'), ('Lubumbashi', 'CD', 'Africa/Lubumbashi'), ('Manaus', 'BR', 'America/Manaus'),
    ('Rio Branco', 'BR', 'America/Rio_Branco'), ('Tijuana', 'MX', 'America/Tijuana'), ('Cancún', 'MX', 'America/Cancun'),
    ('Hermosillo', 'MX', 'America/Hermosillo'), ('Taipei', 'CN', 'Asia/Taipei'), ('Hong Kong', 'CN', 'Asia/Hong_Kong'),
    ('Nuuk', 'GL', 'America/Nuuk'), ('Ushuaia', 'AR', 'America/Argentina/Ushuaia'),
]

SCRIPTS = {
    'ru': r'[Ѐ-ӿ]', 'zh': r'[一-鿿㐀-䶿]', 'ja': r'[぀-ヿ一-鿿]',
    'ar': r'[؀-ۿ]', 'hi': r'[ऀ-ॿ]', 'bn': r'[ঀ-৿]', 'pa': r'[਀-੿]',
}


# --------------------------------------------------------------------------- audit

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--cache', default=os.path.join(HERE, '.cache'))
    ap.add_argument('--out', default=os.path.join(PKG, 'AUDIT.md'))
    ap.add_argument('--json', default=os.path.join(HERE, 'audit.json'))
    ap.add_argument('--sample-per-country', type=int, default=15)
    args = ap.parse_args()
    cache = os.path.abspath(args.cache)
    random.seed(20261018)

    continents, countries, states, cities, tz_list = decode()
    report = json.load(open(os.path.join(HERE, 'build-report.json'), encoding='utf-8'))
    aux = pickle.load(open(os.path.join(cache, 'audit-input.pickle'), 'rb'))
    state_geoms, country_geoms = aux['state_geoms'], aux['country_geoms']
    internal = {c['id']: c for c in aux['cities']}
    A = collections.OrderedDict()
    findings = []

    # ---- 1. standards conformance
    iso1 = {c.alpha_2: c for c in pycountry.countries}
    bad_country = [c['iso'] for c in countries if c['iso'] not in iso1 or iso1[c['iso']].alpha_3 != c['iso3']
                   or iso1[c['iso']].numeric != c['numeric']]
    missing_iso1 = sorted(set(iso1) - {c['iso'] for c in countries} - set(config.FOLD_INTO))
    iso2 = {s.code for s in pycountry.subdivisions}
    state_codes = {s['iso'] for s in states}
    not_iso2 = sorted(c for c in state_codes if c not in iso2 and c not in config.ADD_SUBDIVISIONS)
    valid_tz = zoneinfo.available_timezones()
    bad_tz = sorted({z for z in tz_list if z not in valid_tz})
    # zone1970.tab lists every country a zone covers (Asia/Bangkok: TH, KH, LA, VN, CX); zone.tab
    # only one. Use both.
    zone_tab = collections.defaultdict(set)
    tab_files = ['/usr/share/zoneinfo/zone.tab']
    try:
        import tzdata
        tab_files.append(os.path.join(os.path.dirname(tzdata.__file__), 'zoneinfo', 'zone1970.tab'))
    except ImportError:
        pass
    for tab in tab_files:
        for line in open(tab, encoding='utf-8'):
            if not line.startswith('#') and line.strip():
                p = line.split('\t')
                for cc in p[0].split(','):
                    zone_tab[config.FOLD_INTO.get(cc, (cc,))[0]].add(p[2].strip())
    city_tz_off = [c for c in cities if zone_tab.get(c['country']) and c['tz'] not in zone_tab[c['country']]]
    A['standards'] = {
        'countries': len(countries), 'country_code_errors': bad_country, 'iso3166_1_not_included': missing_iso1,
        'states': len(states), 'state_codes_not_in_iso3166_2': not_iso2,
        'timezones': len(tz_list), 'invalid_timezones': bad_tz,
        'cities_with_zone_outside_country_zone_tab': len(city_tz_off),
        'cities_with_zone_outside_country_zone_tab_examples': collections.Counter(
            '%s:%s' % (c['country'], c['tz']) for c in city_tz_off).most_common(12),
        'duplicate_city_ids': len(cities) - len({c['id'] for c in cities}),
        'duplicate_state_codes': len(states) - len(state_codes),
    }

    # ---- 2. centre coordinates
    ne0 = json.load(open(os.path.join(cache, 'naturalearth', 'ne_10m_admin_0_countries.geojson'), encoding='utf-8'))
    ne_label = {}
    for f in ne0['features']:
        p = f['properties']
        if p['ISO_A2_EH'] not in ('-99',) and p['TYPE'] != 'Dependency' or p['ISO_A2_EH'] not in ne_label:
            ne_label.setdefault(p['ISO_A2_EH'], (p['LABEL_X'], p['LABEL_Y']))
    wd_country = {}
    for r in csv.DictReader(open(os.path.join(cache, 'wikidata', 'countries.csv'), encoding='utf-8')):
        m = re.match(r'Point\(([-\d.eE]+) ([-\d.eE]+)\)', r.get('coord') or '')
        if m:
            wd_country.setdefault(r['cc'], (float(m.group(1)), float(m.group(2))))
    snap = json.load(open(os.path.join(cache, 'snapshot.json'), encoding='utf-8'))
    area = {c['iso2']: c['area'] for c in snap['countries']}
    area.update({s['code']: s['area'] for s in snap['states']})
    method = report['centre_method']

    def centre_check(items, geoms, refs):
        inside, rows = 0, []
        with_geom = 0
        rel = {k: [] for k in refs}
        for it in items:
            g = geoms.get(it['iso'])
            if g is not None and not g.is_empty:
                with_geom += 1
                if g.buffer(0.01).contains(Point(it['lng'], it['lat'])):
                    inside += 1
                else:
                    rows.append(it['iso'])
            size = math.sqrt(area.get(it['iso']) or 0) or None
            for name, ref in refs.items():
                if it['iso'] in ref:
                    lon, lat = ref[it['iso']]
                    d = km(it['lng'], it['lat'], lon, lat)
                    rel[name].append((d, d / size if size else None, it['iso']))
        out = {'with_polygon': with_geom, 'inside_own_polygon': inside, 'inside_rate': pct(inside, with_geom),
               'outside': rows}
        for name, vals in rel.items():
            out['vs_' + name + '_km'] = stats([v[0] for v in vals])
            norm_vals = [v[1] for v in vals if v[1] is not None]
            out['vs_' + name + '_relative_to_size'] = stats(norm_vals)
            out['vs_' + name + '_largest'] = sorted(((round(v[0]), round(v[1], 2) if v[1] else None, v[2])
                                                     for v in vals), key=lambda x: -(x[1] or 0))[:10]
        return out

    A['country_centres'] = centre_check(countries, country_geoms, {'naturalearth_label': ne_label, 'wikidata': wd_country})
    A['country_centres']['methods'] = collections.Counter(method[c['iso']] for c in countries)

    ne1 = json.load(open(os.path.join(cache, 'naturalearth', 'ne_10m_admin_1_states_provinces.geojson'), encoding='utf-8'))
    conflicted = {c[0] for c in report.get('polygon_code_name_conflicts', [])}
    ne1_label = {}
    for f in ne1['features']:
        p = f['properties']
        if p['iso_3166_2'] in state_codes and p['iso_3166_2'] not in conflicted and p['latitude'] is not None:
            ne1_label.setdefault(p['iso_3166_2'], (p['longitude'], p['latitude']))
    wd_state = {s['code']: tuple(s['wd_coord']) for s in snap['states'] if s.get('wd_coord')}
    A['state_centres'] = centre_check(states, state_geoms, {'naturalearth_label': ne1_label, 'wikidata': wd_state})
    A['state_centres']['methods'] = collections.Counter(method[s['iso']] for s in states)
    A['state_centres']['approximate'] = sorted(s['iso'] for s in states
                                               if method[s['iso']] in ('wikidata-point', 'mean-of-cities', 'country-centre'))

    cont_rows = []
    for c in continents:
        members = [x for x in countries if x['continent'] == c['iso']]
        on_land = next((x['iso'] for x in members if country_geoms.get(x['iso']) is not None
                        and country_geoms[x['iso']].contains(Point(c['lng'], c['lat']))), None)
        cont_rows.append({'continent': c['iso'], 'lat': c['lat'], 'lng': c['lng'], 'inside_country': on_land})
    A['continent_centres'] = cont_rows

    # ---- 3. city coordinates and placement
    links = wikidata_links(cache)
    dists, worst = [], []
    for c in cities:
        if c['id'] > 0 and c['id'] in links:
            q, lon, lat = links[c['id']]
            d = km(c['lng'], c['lat'], lon, lat)
            dists.append(d)
            worst.append((round(d, 1), c['name'], c['country'], q))
    worst.sort(reverse=True)
    in_country = in_state = with_state_geom = 0
    out_country = []
    by_cc = collections.defaultdict(list)
    by_st = collections.defaultdict(list)
    for c in cities:
        by_cc[c['country']].append(c)
        if c['state'] and c['state'] in state_geoms:
            by_st[c['state']].append(c)
    for cc, cs in by_cc.items():
        g = country_geoms.get(cc)
        if g is None:
            continue
        xs, ys = np.array([c['lng'] for c in cs]), np.array([c['lat'] for c in cs])
        inside = shapely.contains_xy(g, xs, ys)
        for c, ok in zip(cs, inside):
            if ok or g.distance(Point(c['lng'], c['lat'])) <= 0.1:
                in_country += 1
            else:
                out_country.append((c['name'], c['country']))
    for st, cs in by_st.items():
        g = state_geoms[st]
        xs, ys = np.array([c['lng'] for c in cs]), np.array([c['lat'] for c in cs])
        inside = shapely.contains_xy(g, xs, ys)
        with_state_geom += len(cs)
        for c, ok in zip(cs, inside):
            if ok or g.distance(Point(c['lng'], c['lat'])) <= 0.03:
                in_state += 1
    A['city_coordinates'] = {
        'cities': len(cities),
        'vs_wikidata_same_entity_km': stats(dists),
        'within_1km_of_wikidata': pct(sum(d <= 1 for d in dists), len(dists)),
        'within_5km_of_wikidata': pct(sum(d <= 5 for d in dists), len(dists)),
        'within_10km_of_wikidata': pct(sum(d <= 10 for d in dists), len(dists)),
        'largest_differences': worst[:15],
        'inside_country_polygon_10km': pct(in_country, len(cities)),
        'outside_country_examples': out_country[:15],
        'inside_state_polygon_3km': pct(in_state, with_state_geom),
        'rounding_error_bound_m': round(0.5 / 10 ** config.PRECISION * 111320 * math.sqrt(2)),
    }

    # ---- 4. city -> state
    agree = total = 0
    for c in cities:
        ic = internal.get(c['id'])
        if ic and ic.get('how') == 'admin' and ic.get('pip') and ic.get('pip_km') == 0.0:
            total += 1
            agree += ic['pip'] == c['state']
    A['city_state_signals'] = {
        'assignment_methods': report['city_state_assignment'],
        'admin_vs_polygon_agreement': pct(agree, total), 'compared': total,
        'polygon_relabels': report.get('polygon_relabels'), 'admin_unit_remaps': report.get('admin_unit_remaps'),
    }
    # Independent check against Wikidata P131 chains on a stratified sample.
    by_country = collections.defaultdict(list)
    for c in cities:
        if c['state'] and c['id'] > 0 and c['id'] in links:
            by_country[c['country']].append(c)
    sample = []
    for cc, cs in sorted(by_country.items()):
        sample += random.sample(cs, min(args.sample_per_country, len(cs)))
    qmap = {links[c['id']][0]: c for c in sample}
    found = collections.defaultdict(set)
    items = sorted(qmap)
    for i in range(0, len(items), 150):
        chunk = items[i:i + 150]
        rows = sparql('SELECT ?item ?code WHERE { VALUES ?item { %s } ?item wdt:P131+ ?a. ?a wdt:P300 ?code. }'
                      % ' '.join('wd:' + q for q in chunk), os.path.join(cache, 'audit', 'p131_%05d.csv' % i))
        for r in rows or []:
            found[r['item'].rsplit('/', 1)[-1]].add(r['code'])
    wd_agree = wd_total = 0
    wd_mismatch = []
    for q, c in qmap.items():
        codes = {x for x in found.get(q, ()) if x.startswith(c['country'] + '-')}
        tops = {top_level(x, state_codes) for x in codes} - {None}
        if c['country'] == 'CN' and c['state'] in ('CN-TW', 'CN-HK', 'CN-MO'):
            continue
        if not tops:
            continue
        wd_total += 1
        if c['state'] in tops:
            wd_agree += 1
        else:
            wd_mismatch.append((c['name'], c['country'], c['state'], sorted(tops)))
    A['city_state_vs_wikidata'] = {
        'sampled': len(sample), 'comparable': wd_total, 'agreement': pct(wd_agree, wd_total),
        'mismatch_examples': wd_mismatch[:25],
        'mismatches_by_country': collections.Counter(m[1] for m in wd_mismatch).most_common(15),
    }
    known = []
    idx = collections.defaultdict(list)
    for c in cities:
        idx[(c['name'], c['country'])].append(c)
    for name, cc, want in KNOWN_STATE:
        got = [c['state'] for c in idx.get((name, cc), [])]
        known.append((name, cc, want, got[0] if got else None, want in got))
    A['known_city_states'] = {'checked': len(known), 'correct': sum(k[4] for k in known),
                              'failures': [k for k in known if not k[4]]}
    ktz = []
    for name, cc, want in KNOWN_TZ:
        got = [c['tz'] for c in idx.get((name, cc), [])]
        ktz.append((name, cc, want, got[0] if got else None, want in got))
    A['known_city_timezones'] = {'checked': len(ktz), 'correct': sum(k[4] for k in ktz),
                                 'failures': [k for k in ktz if not k[4]]}

    # ---- 5. time zone sanity for states: offset vs solar time at the centre
    now = datetime(2026, 1, 15, 12, tzinfo=timezone.utc)
    odd = []
    for s in states:
        off = zoneinfo.ZoneInfo(s['tz'][0]).utcoffset(now).total_seconds() / 3600
        solar = s['lng'] / 15
        if abs(off - solar) > 3.5:
            odd.append((s['iso'], s['name'], s['tz'][0], round(off, 1), round(solar, 1)))
    A['state_timezone_solar_check'] = {'states': len(states), 'over_3_5h_from_solar_time': odd}
    A['states_with_multiple_zones'] = sum(len(s['tz']) > 1 for s in states)

    # ---- 6. translations
    tr = {}
    for lang in config.LANGS:
        if lang == 'en':
            continue
        core = json.load(open(os.path.join(DATA, 'i18n', lang, 'core.json'), encoding='utf-8'))
        names = list(core['countries'].values()) + list(core['states'].values())
        city_names = []
        d = os.path.join(DATA, 'i18n', lang, 'cities')
        if os.path.isdir(d):
            for f in os.listdir(d):
                city_names += json.load(open(os.path.join(d, f), encoding='utf-8'))[1]
        row = {'countries': len(core['countries']), 'states': len(core['states']), 'cities': len(city_names)}
        if lang in SCRIPTS:
            rx = re.compile(SCRIPTS[lang])
            row['expected_script_rate'] = pct(sum(bool(rx.search(n)) for n in names + city_names), len(names + city_names))
        tr[lang] = row
    A['translations'] = tr

    # ---- 7. completeness
    per_state = collections.Counter(c['state'] for c in cities if c['state'])
    per_country = collections.Counter(c['country'] for c in cities)
    pops = {}
    for line in open(os.path.join(cache, 'geonames', 'countryInfo.txt'), encoding='utf-8'):
        if not line.startswith('#'):
            p = line.rstrip('\n').split('\t')
            cc = config.FOLD_INTO.get(p[0], (p[0],))[0]
            pops[cc] = pops.get(cc, 0) + int(p[7] or 0)
    density = sorted(((round(per_country[c['iso']] / (pops[c['iso']] / 1e6), 1), c['iso'], per_country[c['iso']])
                      for c in countries if pops.get(c['iso'], 0) > 2e6))
    A['completeness'] = {
        'states_without_cities': sorted(s['iso'] for s in states if not per_state.get(s['iso'])),
        'countries_without_cities': sorted(c['iso'] for c in countries if not per_country.get(c['iso'])),
        'cities_by_source': report['totals']['cities_by_source'],
        'lowest_cities_per_million': density[:15],
        'thin_coverage_countries_supplemented_by_wikidata': report.get('thin_coverage_countries'),
    }

    # ---- 8. before / after
    legacy = os.path.join(PKG, 'legacy', 'data.json')
    if os.path.exists(legacy):
        old = json.load(open(legacy, encoding='utf-8'))
        old_countries = [c for co in old for c in co['cn']]
        old_states = [(c['i'], s) for c in old_countries for s in c.get('s', [])]
        old_cities = [(c['i'], s['i'], x) for c in old_countries for s in c.get('s', []) for x in s.get('c', [])]
        new_by_name = collections.defaultdict(list)
        for c in cities:
            new_by_name[(c['country'], norm(c['name']))].append(c)
        errs = []
        for cc, _s, x in old_cities:
            coor = (x.get('mtd') or {}).get('coor')
            cand = new_by_name.get((cc, norm(x['n'])))
            if coor and cand:
                errs.append(min(km(coor['lng'], coor['lat'], c['lng'], c['lat']) for c in cand))
        old_iso_states = sum(1 for cc, s in old_states if '%s-%s' % (cc, s['i']) in iso2)
        new_c = {c['iso']: c for c in countries}
        cerr = [km(c['mtd']['coor']['lng'], c['mtd']['coor']['lat'], new_c[c['i']]['lng'], new_c[c['i']]['lat'])
                for c in old_countries if c['i'] in new_c and (c.get('mtd') or {}).get('coor')]
        A['before_after'] = {
            'old': {'countries': len(old_countries), 'states': len(old_states), 'cities': len(old_cities),
                    'states_with_valid_iso3166_2_code': pct(old_iso_states, len(old_states)),
                    'countries_with_states': sum(1 for c in old_countries if c.get('s'))},
            'new': {'countries': len(countries), 'states': len(states), 'cities': len(cities),
                    'states_with_valid_iso3166_2_code': pct(len(states) - len(not_iso2), len(states)),
                    'countries_with_states': len({s['country'] for s in states})},
            'old_city_coordinates_error_km': stats(errs),
            'old_country_coordinates_distance_to_new_centre_km': stats(cerr),
        }

    # ---- 9. bundle size
    A['bundle'] = bundle_sizes()

    json.dump(A, open(args.json, 'w', encoding='utf-8'), ensure_ascii=False, indent=1, default=str)
    write_markdown(A, args.out)
    print('wrote', args.out, file=sys.stderr)


def bundle_sizes():
    """Bundle the library the way an app would (esbuild, minified) and report gzip sizes."""
    import tempfile
    dist = os.path.join(PKG, 'dist', 'esm')
    out = {}
    if not os.path.isdir(dist):
        return {'error': 'dist/esm missing: run npm run build first'}
    entries = {
        'Continents only': 'import { Continents } from "%s"; console.log(Continents.getAll);',
        'Countries only': 'import { Countries } from "%s"; console.log(Countries.getAll);',
        'States (+countries)': 'import { States } from "%s"; console.log(States.getAll);',
        'Cities loader (no city data yet)': 'import { Cities } from "%s"; Cities.getByCountry("GH").then(console.log);',
        'Everything except city chunks': 'import * as G from "%s"; console.log(G);',
    }
    tmp = tempfile.mkdtemp()
    for label, code in entries.items():
        src = os.path.join(tmp, 'entry.mjs')
        open(src, 'w').write(code % os.path.join(dist, 'index.js'))
        outdir = os.path.join(tmp, 'out')
        try:
            subprocess.run(['npx', '--yes', 'esbuild@0.24.2', src, '--bundle', '--minify', '--format=esm',
                            '--splitting', '--outdir=' + outdir, '--log-level=error'],
                           check=True, capture_output=True, timeout=300)
        except Exception as e:  # noqa: BLE001
            return {'error': 'esbuild unavailable: %s' % e}
        main = open(os.path.join(outdir, 'entry.js'), 'rb').read()
        # Statically imported shared chunks count towards the initial load.
        initial = len(gzip.compress(main, 9))
        for f in re.findall(rb'from"\./([\w-]+\.js)"', main):
            initial += len(gzip.compress(open(os.path.join(outdir, f.decode()), 'rb').read(), 9))
        out[label] = {'initial_kb_gzip': round(initial / 1024, 1)}
        subprocess.run(['rm', '-rf', outdir])
    sizes = []
    for f in os.listdir(os.path.join(DATA, 'cities')):
        b = open(os.path.join(DATA, 'cities', f), 'rb').read()
        sizes.append((len(gzip.compress(b, 9)), f[:-5]))
    sizes.sort()
    out['city_chunk_kb_gzip'] = {
        'countries': len(sizes), 'median': round(sizes[len(sizes) // 2][0] / 1024, 1),
        'largest': [(cc, round(s / 1024, 1)) for s, cc in sizes[-5:][::-1]],
        'all_countries_total': round(sum(s for s, _ in sizes) / 1024, 1),
    }
    for cc in ('GH', 'NG', 'KE', 'DE', 'IN'):
        b = open(os.path.join(DATA, 'cities', cc + '.json'), 'rb').read()
        out['city_chunk_kb_gzip'][cc] = round(len(gzip.compress(b, 9)) / 1024, 1)
    legacy = os.path.join(PKG, 'legacy', 'data.json')
    if os.path.exists(legacy):
        b = open(legacy, 'rb').read()
        out['previous_release_data_json'] = {'raw_mb': round(len(b) / 1e6, 1), 'gzip_mb': round(len(gzip.compress(b, 6)) / 1e6, 2),
                                             'note': 'imported by every module in the previous release'}
    return out


def write_markdown(A, path):
    L = []
    w = L.append
    w('# Data accuracy audit\n')
    w('Generated by `scripts/build-data/audit.py` on %s. Machine-readable results: '
      '`scripts/build-data/audit.json`.\n' % datetime.now().strftime('%Y-%m-%d'))
    s = A['standards']
    w('## 1. Standards conformance\n')
    w('| Check | Result |\n|---|---|')
    w('| Countries (ISO 3166-1) | %d, code errors: %d |' % (s['countries'], len(s['country_code_errors'])))
    w('| ISO 3166-1 entries not listed as countries | %s (folded into CN as subdivisions) |' % ', '.join(sorted(config.FOLD_INTO)))
    w('| States (ISO 3166-2 first level) | %d, codes not in ISO 3166-2: %s |' % (s['states'], ', '.join(s['state_codes_not_in_iso3166_2']) or 'none'))
    w('| Duplicate state codes / city ids | %d / %d |' % (s['duplicate_state_codes'], s['duplicate_city_ids']))
    w('| IANA time zones referenced | %d, invalid: %d |' % (s['timezones'], len(s['invalid_timezones'])))
    w('| Cities whose zone is not listed for their country in zone.tab | %d |' % s['cities_with_zone_outside_country_zone_tab'])
    w('')
    for key, title in (('country_centres', '2. Country centres'), ('state_centres', '3. State centres')):
        c = A[key]
        w('## %s\n' % title)
        w('- Centre lies inside the territory\'s own polygon: **%s** (%d of %d with a polygon).' % (
            c['inside_rate'], c['inside_own_polygon'], c['with_polygon']))
        w('- Method: %s.' % ', '.join('%s %d' % kv for kv in sorted(c['methods'].items(), key=lambda x: -x[1])))
        for ref in ('naturalearth_label', 'wikidata'):
            st, rel = c['vs_%s_km' % ref], c['vs_%s_relative_to_size' % ref]
            if st.get('n'):
                w('- Distance to %s point: median %.0f km, p90 %.0f km (median %.2f, p90 %.2f of the territory\'s '
                  'size, i.e. sqrt(area)), n=%d.' % (ref.replace('_', ' '), st['median'], st['p90'],
                                                     rel.get('median', 0), rel.get('p90', 0), st['n']))
        if c.get('approximate'):
            w('- Approximate centres (no usable polygon): %s.' % ', '.join(c['approximate']))
        w('')
    w('## 4. Continent centres\n')
    w('| Continent | Lat | Lng | Lies in |\n|---|---|---|---|')
    for r in A['continent_centres']:
        w('| %s | %.3f | %.3f | %s |' % (r['continent'], r['lat'], r['lng'], r['inside_country'] or '(sea/ice)'))
    w('')
    c = A['city_coordinates']
    w('## 5. City coordinates\n')
    st = c['vs_wikidata_same_entity_km']
    w('- %d cities. Compared with Wikidata\'s coordinate for the same place (n=%d): median %.2f km, p90 %.2f km, '
      'p95 %.2f km.' % (c['cities'], st['n'], st['median'], st['p90'], st['p95']))
    w('- Within 1 km: %s; within 5 km: %s; within 10 km: %s.' % (
        c['within_1km_of_wikidata'], c['within_5km_of_wikidata'], c['within_10km_of_wikidata']))
    w('- Inside their country (10 km tolerance): %s. Inside their state polygon (3 km): %s.' % (
        c['inside_country_polygon_10km'], c['inside_state_polygon_3km']))
    w('- Rounding to %d decimals adds at most ~%d m.' % (config.PRECISION, c['rounding_error_bound_m']))
    w('')
    c = A['city_state_vs_wikidata']
    sg = A['city_state_signals']
    w('## 6. City → state assignment\n')
    w('- Methods: %s.' % ', '.join('%s %d' % kv for kv in sorted(sg['assignment_methods'].items(), key=lambda x: -x[1])))
    w('- GeoNames hierarchy and polygons agree for **%s** of %d cities checked by both.' % (sg['admin_vs_polygon_agreement'], sg['compared']))
    w('- Independent check against Wikidata "located in" (P131) chains, stratified sample: **%s** agreement '
      '(%d comparable of %d sampled).' % (c['agreement'], c['comparable'], c['sampled']))
    k = A['known_city_states']
    w('- Hand-verified known answers: **%d / %d** correct.' % (k['correct'], k['checked']))
    if k['failures']:
        w('  - Failures: %s' % '; '.join('%s (%s): expected %s, got %s' % f[:4] for f in k['failures']))
    w('')
    w('## 7. Time zones\n')
    k = A['known_city_timezones']
    w('- Hand-verified known answers: **%d / %d** correct.' % (k['correct'], k['checked']))
    if k['failures']:
        w('  - Failures: %s' % '; '.join('%s (%s): expected %s, got %s' % f[:4] for f in k['failures']))
    t = A['state_timezone_solar_check']
    w('- States whose main zone is more than 3.5 h from solar time at their centre: %d (expected for e.g. western '
      'China, which uses Beijing time).' % len(t['over_3_5h_from_solar_time']))
    w('- States spanning several zones: %d.' % A['states_with_multiple_zones'])
    w('')
    w('## 8. Translations\n')
    w('| Language | Countries | States | Cities | Expected script |\n|---|---|---|---|---|')
    for lang, r in A['translations'].items():
        w('| %s | %d | %d | %d | %s |' % (lang, r['countries'], r['states'], r['cities'], r.get('expected_script_rate', 'Latin')))
    w('')
    c = A['completeness']
    w('## 9. Completeness\n')
    w('- Cities by source: %s.' % ', '.join('%s %d' % kv for kv in c['cities_by_source'].items()))
    w('- States without any city: %d.' % len(c['states_without_cities']))
    w('- Countries without any city: %s.' % (', '.join(c['countries_without_cities']) or 'none'))
    w('')
    if 'before_after' in A:
        b = A['before_after']
        w('## 10. Previous release vs this one\n')
        w('| | Previous | Now |\n|---|---|---|')
        for key in ('countries', 'states', 'cities', 'countries_with_states', 'states_with_valid_iso3166_2_code'):
            w('| %s | %s | %s |' % (key.replace('_', ' '), b['old'][key], b['new'][key]))
        e = b['old_city_coordinates_error_km']
        if e.get('n'):
            w('\nPrevious city coordinates vs the verified ones (same city name and country, n=%d): median error '
              '%.0f km, p90 %.0f km.' % (e['n'], e['median'], e['p90']))
        w('')
    bnd = A['bundle']
    w('## 11. Bundle size\n')
    if 'error' in bnd:
        w(bnd['error'])
    else:
        w('| Import | Initial download (min + gzip) |\n|---|---|')
        for k2, v in bnd.items():
            if isinstance(v, dict) and 'initial_kb_gzip' in v:
                w('| %s | %.1f kB |' % (k2, v['initial_kb_gzip']))
        cc = bnd['city_chunk_kb_gzip']
        w('\nCity data loads per country on demand: median %.1f kB gzip, Ghana %.1f kB, Nigeria %.1f kB, '
          'India %.1f kB; largest %s.' % (cc['median'], cc['GH'], cc['NG'], cc['IN'],
                                          ', '.join('%s %.0f kB' % x for x in cc['largest'])))
        if 'previous_release_data_json' in bnd:
            p = bnd['previous_release_data_json']
            w('\nThe previous release bundled a %.1f MB data.json (%.2f MB gzip) into every import.' % (p['raw_mb'], p['gzip_mb']))
    w('')
    open(path, 'w', encoding='utf-8').write('\n'.join(L) + '\n')


if __name__ == '__main__':
    main()
