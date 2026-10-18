"""Download every upstream source used to build the dataset into a cache directory.

Usage: python3 -I fetch.py [--cache DIR]

Sources (all open licensed, see README.md for attribution):
  - GeoNames            cities, admin codes, alternate names, country info (CC BY 4.0)
  - Natural Earth       admin-0 / admin-1 polygons (public domain)
  - geoBoundaries       ADM1 polygons, per country (CC BY / ODbL, varies by country)
  - Wikidata            ISO 3166-2 items + labels, typed cities/towns (CC0)
"""
import argparse
import collections
import csv
import io
import json
import os
import sys
import time
import urllib.parse
import urllib.request
import ssl
import zipfile
from concurrent.futures import ThreadPoolExecutor

try:  # python.org builds ship without a CA bundle; certifi fixes that when present
    import certifi
    SSL_CTX = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    SSL_CTX = ssl.create_default_context()

HERE = os.path.dirname(os.path.abspath(__file__))
UA = 'countries-geo-data-builder/1.0 (https://github.com/godfrednanaowusu/countries-geo)'

GEONAMES = 'https://download.geonames.org/export/dump/'
GEONAMES_FILES = [
    'cities500.zip', 'admin1CodesASCII.txt', 'admin2Codes.txt', 'countryInfo.txt', 'timeZones.txt',
    'alternateNamesV2.zip',
]
NATURAL_EARTH = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'
NATURAL_EARTH_FILES = ['ne_10m_admin_0_countries.geojson', 'ne_10m_admin_1_states_provinces.geojson']
GEOBOUNDARIES_INDEX = 'https://www.geoboundaries.org/api/current/gbOpen/ALL/ADM1/'
WIKIDATA_SPARQL = 'https://query.wikidata.org/sparql'
QLEVER = 'https://qlever.dev/api/wikidata'
QLEVER_PREFIXES = ('PREFIX wd: <http://www.wikidata.org/entity/> PREFIX wdt: <http://www.wikidata.org/prop/direct/> '
                   'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX schema: <http://schema.org/> ')

LANGS = ['en', 'fr', 'de', 'es', 'pt', 'ru', 'zh', 'ja', 'ar', 'hi', 'bn', 'pa']

# Classes whose (transitive) instances count as a city or town. Generic "human settlement"
# and "village" are deliberately excluded: Wikidata holds millions of bot-imported hamlets.
NOT_A_TOWN_ROOTS = [
    'Q15661340', 'Q839954', 'Q74047', 'Q19953632', 'Q350895', 'Q15893266', 'Q123705', 'Q2983893',
    'Q15640612', 'Q188509', 'Q130003', 'Q1307276', 'Q2074737', 'Q1266818', 'Q148837', 'Q3191695',
    'Q12813115', 'Q1145776', 'Q14762300',
]

WD_CITY_CLASSES = ['Q515', 'Q3957', 'Q1549591', 'Q1637706', 'Q5119', 'Q7930989', 'Q200250']


def get(url, dest, binary=True):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return dest
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    print('  downloading', url, file=sys.stderr)
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=600, context=SSL_CTX) as r, open(dest + '.part', 'wb') as f:
                while True:
                    chunk = r.read(1 << 20)
                    if not chunk:
                        break
                    f.write(chunk)
            os.replace(dest + '.part', dest)
            return dest
        except Exception as e:  # network hiccups: back off and retry
            print('    retry', attempt + 1, e, file=sys.stderr)
            time.sleep(5 * (attempt + 1))
    raise RuntimeError('failed to download ' + url)


def sparql(query, dest, required=True, attempts=6, endpoint=None):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return dest
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    body = urllib.parse.urlencode({'query': query}).encode()
    req = urllib.request.Request(endpoint or WIKIDATA_SPARQL, data=body, headers={
        'User-Agent': UA, 'Accept': 'text/csv', 'Content-Type': 'application/x-www-form-urlencoded'})
    for attempt in range(attempts):
        try:
            with urllib.request.urlopen(req, timeout=300, context=SSL_CTX) as r:
                body = r.read()
            with open(dest, 'wb') as f:
                f.write(body)
            time.sleep(1)
            return dest
        except Exception as e:
            print('    sparql retry', attempt + 1, os.path.basename(dest), e, file=sys.stderr)
            time.sleep(10 * (attempt + 1))
    if required:
        raise RuntimeError('sparql failed for ' + dest)
    print('  SKIPPED (query kept failing):', dest, file=sys.stderr)
    return None


def fetch_geonames(cache):
    for f in GEONAMES_FILES:
        get(GEONAMES + f, os.path.join(cache, 'geonames', f))
    # Pre-extract cities; alternate names are streamed straight from the zip later.
    z = os.path.join(cache, 'geonames', 'cities500.zip')
    out = os.path.join(cache, 'geonames', 'cities500.txt')
    if not os.path.exists(out):
        with zipfile.ZipFile(z) as zf:
            zf.extract('cities500.txt', os.path.join(cache, 'geonames'))


def fetch_natural_earth(cache):
    for f in NATURAL_EARTH_FILES:
        get(NATURAL_EARTH + f, os.path.join(cache, 'naturalearth', f))


def fetch_geoboundaries(cache):
    idx = get(GEOBOUNDARIES_INDEX, os.path.join(cache, 'geoboundaries', 'index.json'))
    for meta in json.load(open(idx)):
        iso3 = meta['boundaryISO']
        get(meta['simplifiedGeometryGeoJSON'], os.path.join(cache, 'geoboundaries', iso3 + '.geojson'))


def fetch_wikidata(cache, countries):
    d = os.path.join(cache, 'wikidata')
    sparql('SELECT ?item ?code ?gn ?end ?coord ?succ WHERE { ?item wdt:P300 ?code. '
           'OPTIONAL{?item wdt:P1566 ?gn} OPTIONAL{?item wdt:P576 ?end} '
           'OPTIONAL{?item wdt:P625 ?coord} OPTIONAL{?item wdt:P1366 ?succ} }',
           os.path.join(d, 'iso2_items.csv'))
    langs = ','.join('"%s"' % l for l in LANGS)
    sparql('SELECT ?item ?l ?lang WHERE { ?item wdt:P300 []; rdfs:label ?l. BIND(LANG(?l) AS ?lang) '
           'FILTER(?lang IN (%s)) }' % langs, os.path.join(d, 'iso2_labels.csv'))
    # Wikidata items for countries (needed to scope the per-country city queries).
    sparql('SELECT ?item ?cc ?coord WHERE { ?item wdt:P297 ?cc. OPTIONAL{?item wdt:P625 ?coord} }', os.path.join(d, 'countries.csv'))
    qids = {}
    for r in csv.DictReader(open(os.path.join(d, 'countries.csv'))):
        qids.setdefault(r['cc'], r['item'].rsplit('/', 1)[-1])
    # Cities/towns of every country in one query. QLever (a fast SPARQL engine over the same
    # Wikidata dump) answers it in well under a minute; the public WDQS endpoint times out on
    # the largest countries. The result is split into one file per country.
    roots = ' '.join('wd:' + c for c in WD_CITY_CLASSES)
    combined = os.path.join(d, 'cities_all.csv')
    sparql(QLEVER_PREFIXES +
           'SELECT ?item ?cc ?coord ?gn ?pop ?end (GROUP_CONCAT(DISTINCT STR(?t); SEPARATOR="|") AS ?types) '
           '(SAMPLE(?en) AS ?label) (SAMPLE(?ew) AS ?enwiki) (SAMPLE(?fw) AS ?frwiki) '
           'WHERE { VALUES ?cls { %s } ?t wdt:P279* ?cls . '
           '?item wdt:P31 ?t ; wdt:P17 ?country ; wdt:P625 ?coord . ?country wdt:P297 ?cc . '
           'OPTIONAL { ?item wdt:P1566 ?gn } OPTIONAL { ?item wdt:P1082 ?pop } OPTIONAL { ?item wdt:P576 ?end } '
           'OPTIONAL { ?item rdfs:label ?en . FILTER(LANG(?en) = "en") } '
           'OPTIONAL { ?ew schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> } '
           'OPTIONAL { ?fw schema:about ?item ; schema:isPartOf <https://fr.wikipedia.org/> } } '
           'GROUP BY ?item ?cc ?coord ?gn ?pop ?end' % roots, combined, endpoint=QLEVER)
    per_country = collections.defaultdict(list)
    with open(combined, encoding='utf-8') as fh:
        reader = csv.DictReader(fh)
        fields = [f for f in reader.fieldnames if f != 'cc']
        for r in reader:
            per_country[r['cc']].append(r)
    os.makedirs(os.path.join(d, 'cities'), exist_ok=True)
    for cc in countries:
        with open(os.path.join(d, 'cities', cc + '.csv'), 'w', encoding='utf-8', newline='') as out:
            w = csv.DictWriter(out, fieldnames=fields, extrasaction='ignore')
            w.writeheader()
            w.writerows(per_country.get(cc, []))
    # Classes among those types that denote places which are not current towns (ancient or
    # archaeological sites, abandoned/former settlements, suburbs and districts, resorts).
    types = set()
    for r in csv.DictReader(open(combined, encoding='utf-8')):
        types.update(t.rsplit('/', 1)[-1] for t in r['types'].split('|') if t)
    roots = ' '.join('wd:' + q for q in NOT_A_TOWN_ROOTS)
    sparql(QLEVER_PREFIXES + 'SELECT DISTINCT ?t WHERE { VALUES ?t { %s } VALUES ?root { %s } ?t wdt:P279* ?root . }'
           % (' '.join('wd:' + t for t in sorted(types)), roots), os.path.join(d, 'not_a_town_types.csv'), endpoint=QLEVER)
    # Labels of those city items in every supported language (for i18n of Wikidata-only cities).
    items = set()
    for f in os.listdir(os.path.join(d, 'cities')):
        for r in csv.DictReader(open(os.path.join(d, 'cities', f))):
            if not r.get('gn'):
                items.add(r['item'].rsplit('/', 1)[-1])
    items = sorted(items)

    def label_query(i):
        chunk = items[i:i + 2000]
        sparql(QLEVER_PREFIXES + 'SELECT ?item ?l ?lang WHERE { VALUES ?item { %s } ?item rdfs:label ?l . '
               'BIND(LANG(?l) AS ?lang) FILTER(?lang IN (%s)) }' % (' '.join('wd:' + x for x in chunk), langs),
               os.path.join(d, 'city_labels', '%05d.csv' % i), required=False, endpoint=QLEVER)

    with ThreadPoolExecutor(max_workers=2) as pool:
        list(pool.map(label_query, range(0, len(items), 2000)))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--cache', default=os.path.join(HERE, '.cache'))
    args = ap.parse_args()
    cache = os.path.abspath(args.cache)
    print('cache:', cache, file=sys.stderr)
    fetch_geonames(cache)
    fetch_natural_earth(cache)
    fetch_geoboundaries(cache)
    import pycountry
    fetch_wikidata(cache, sorted(c.alpha_2 for c in pycountry.countries))
    print('done', file=sys.stderr)


if __name__ == '__main__':
    main()
