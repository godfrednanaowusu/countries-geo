# Data build

Rebuilds `src/data` from open upstream sources. Requires Python 3.10+ with `shapely`, `pyproj`, `numpy`, `pycountry`, `certifi`, and Node 18+ (CLDR names via `Intl`).

```sh
npm run fetch-data   # download sources into scripts/build-data/.cache (~1 GB)
npm run build-data   # write src/data + build-report.json
npm run build        # compile the package
npm run audit        # write AUDIT.md + audit.json
```

`--cache DIR` works on every script to use another cache location.

| File | Role |
| --- | --- |
| `config.py` | Every editorial decision (state levels, reform overrides, thresholds, languages). |
| `countries.base.json` | Curated country list: UN-style names, continent, dialling code. |
| `cities.additions.json` | Places missing upstream, added by hand with a note. |
| `validate_additions.py` | Checks `cities.additions.json` against the committed dataset (stdlib only, used in CI). |
| `fetch.py` | Downloads GeoNames, Natural Earth, geoBoundaries, Wikidata (via QLever). |
| `build.py` | The pipeline (see its docstring). |
| `geo.py` | Equal-area, land-constrained centres. |
| `audit.py` | Independent accuracy audit. |

## Handling a missing or wrong place

Reports come in through the "Missing or wrong place" issue form (label `data`). Never edit `src/data` by hand: the next `build-data` overwrites it.

1. **Check the source link.** Look the place up on GeoNames and Wikidata.
2. **Missing upstream?** Fix it there (add it to GeoNames, or add coordinates, country and a city/town class on Wikidata). It arrives with the next `fetch-data` + `build-data` and helps every user of those sources.
3. **Upstream has it but the build drops it?** Check `build-report.json`: usually a population below the bar, an excluded feature code, or a duplicate. Change `config.py` only if the rule is wrong for everyone.
4. **Neither in time?** Add an entry to `cities.additions.json` with a `note` (where it is, why, the issue link). Use the GeoNames id, or `-N` for Wikidata item `QN`; `state` and `timezone` are optional (the state is otherwise found from the coordinates). Run `npm run validate-additions`; CI runs it on pull requests that touch the file. The build skips an addition once upstream has the same id, so entries retire themselves.
5. Rebuild, release as a patch version, list the change in `CHANGELOG.md`, and close the issue.

How the main fields are produced:

- **States**: ISO 3166-2 first-level subdivisions, with Norway's 2024 and Vietnam's 2025 reforms applied from Wikidata.
- **Centres**: area-weighted centroid in a Lambert equal-area projection centred on the territory. If that falls outside it (archipelagos, crescents), the nearest land part's centroid, then its pole of inaccessibility. Split-up states without a current polygon get a Voronoi share of the old one.
- **Cities**: GeoNames `cities500` (500+ inhabitants, or an administrative seat), plus Wikidata cities/towns GeoNames lacks: those with 500+ recorded inhabitants anywhere, or with no recorded population where GeoNames coverage is thin. Neighbourhoods, historical and abandoned places, administrative units and duplicates are excluded.
- **City → state**: the GeoNames hierarchy joined to ISO codes through Wikidata's GeoNames ids, reconciled with point-in-polygon checks.
- **Time zones**: GeoNames per city; states and countries aggregate their cities by population.
