"""Validate cities.additions.json without the upstream cache (stdlib only, runs in CI).

Errors fail the check; warnings flag entries a reviewer should look at but may be correct.
Checks against the committed dataset in src/data, so run it before `build-data` too.
"""
import json
import os
import re
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, '..', '..', 'src', 'data')

REQUIRED = {'id', 'name', 'country', 'lat', 'lng', 'note'}
OPTIONAL = {'population', 'state', 'timezone'}


def norm(s):
    s = unicodedata.normalize('NFKD', s)
    return ''.join(ch for ch in s if not unicodedata.combining(ch)).casefold().strip()


def load(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def main():
    additions = load(os.path.join(HERE, 'cities.additions.json'))
    countries = [c[0] for c in load(os.path.join(DATA, 'countries.json'))]
    raw_states = load(os.path.join(DATA, 'states.json'))['states']
    states = {f'{countries[s[0]]}-{s[1]}' for s in raw_states}

    errors, warnings = [], []
    if not isinstance(additions, list):
        sys.exit('cities.additions.json must be a JSON array')

    seen_ids, seen_names, city_files = {}, {}, {}
    for i, e in enumerate(additions):
        where = f"#{i} {e.get('name', '?')!r}" if isinstance(e, dict) else f'#{i}'
        if not isinstance(e, dict):
            errors.append(f'{where}: must be an object')
            continue
        err = lambda msg: errors.append(f'{where}: {msg}')

        missing = REQUIRED - e.keys()
        unknown = e.keys() - REQUIRED - OPTIONAL
        if missing:
            err(f"missing {', '.join(sorted(missing))}")
        if unknown:
            err(f"unknown field(s) {', '.join(sorted(unknown))}")

        # Positive ids are GeoNames ids, negative ones Wikidata Q-numbers (-123 for Q123)
        cid = e.get('id')
        if not isinstance(cid, int) or isinstance(cid, bool) or cid == 0:
            err('id must be a non-zero integer (GeoNames id, or -N for Wikidata QN)')
        elif cid in seen_ids:
            err(f'duplicate id (also #{seen_ids[cid]})')
        else:
            seen_ids[cid] = i

        name = e.get('name')
        if not isinstance(name, str) or not name.strip():
            err('name must be a non-empty string')
        if not isinstance(e.get('note'), str) or len(e.get('note', '').strip()) < 10:
            err('note must say where the place is and why it is added (source, report link)')

        cc = e.get('country')
        if cc not in countries:
            err(f'country {cc!r} is not an ISO 3166-1 alpha-2 code in this dataset')

        lat, lng = e.get('lat'), e.get('lng')
        if not isinstance(lat, (int, float)) or isinstance(lat, bool) or not -90 <= lat <= 90:
            err('lat must be a number between -90 and 90')
        if not isinstance(lng, (int, float)) or isinstance(lng, bool) or not -180 <= lng <= 180:
            err('lng must be a number between -180 and 180')

        pop = e.get('population')
        if pop is not None and (not isinstance(pop, int) or isinstance(pop, bool) or pop < 0):
            err('population must be a non-negative integer')

        state = e.get('state')
        if state is not None:
            if not isinstance(state, str) or not state.startswith(f'{cc}-'):
                err(f'state must be a full ISO 3166-2 code of {cc}, e.g. "{cc}-XX"')
            elif state not in states:
                err(f'state {state!r} does not exist in this dataset')

        tz = e.get('timezone')
        if tz is not None and (not isinstance(tz, str) or not re.fullmatch(r'[A-Za-z_]+(/[A-Za-z0-9_+\-]+)+', tz)):
            err('timezone must be an IANA name, e.g. "Africa/Lagos"')

        if not isinstance(name, str) or cc not in countries:
            continue
        key = (cc, norm(name))
        if key in seen_names:
            warnings.append(f'{where}: same name as #{seen_names[key]} in {cc}')
        seen_names[key] = i

        # A shipped city with the same name but another id may be the same place under a different id.
        # (The entry's own id is shipped once the build has applied it, so that is not checked here.)
        if cc not in city_files:
            path = os.path.join(DATA, 'cities', f'{cc}.json')
            city_files[cc] = load(path) if os.path.exists(path) else {'i': [], 'n': []}
        shipped = city_files[cc]
        if any(norm(n) == norm(name) and other != cid for n, other in zip(shipped['n'], shipped['i'])):
            warnings.append(f'{where}: {cc} already has a city with this name; check it is a different place')

    for w in warnings:
        print(f'warning: {w}')
    for e in errors:
        print(f'error: {e}')
    print(f'{len(additions)} addition(s), {len(errors)} error(s), {len(warnings)} warning(s)')
    sys.exit(1 if errors else 0)


if __name__ == '__main__':
    main()
