## Summary

<!-- Briefly describe what this pull request changes and why. -->

## Related Issue

<!-- Link the related issue or discussion. Example: Closes #123 -->

Closes #

## Affected Areas

<!-- Select all areas affected by this pull request. -->

- [ ] Data: places added by hand (`package/scripts/build-data/cities.additions.json`)
- [ ] Data pipeline (`package/scripts/build-data`: `fetch.py`, `build.py`, `geo.py`, `config.py`, `countries.base.json`)
- [ ] Generated dataset (`package/src/data`)
- [ ] Package API or types (`package/src/*.ts`, `package/src/internal`)
- [ ] Package build or publishing (`package/package.json`, `tsconfig*.json`, `scripts/emit-data.mjs`, `scripts/finalize-dist.mjs`)
- [ ] Tests (`package/test`)
- [ ] Accuracy audit (`package/scripts/build-data/audit.py`, `package/AUDIT.md`)
- [ ] Website or docs (`www/app`, `www/app/docs/**/page.mdx`, `www/components`)
- [ ] Website translations (`www/messages/*.json`, `www/i18n`)
- [ ] Repository config (`.github`, workflows, issue templates)
- [ ] README / CHANGELOG
- [ ] Other

## Changes

<!-- List the main changes included in this pull request. -->

-

## Data Changes

<!--
Remove this section if no data changed.
For hand-added places, give a verifiable source (GeoNames, Wikidata, an official
source or Wikipedia). Places that do not exist upstream are not invented.
-->

- [ ] No data changes.
- [ ] Places added to `cities.additions.json`, each with a source and a `note`.
- [ ] The dataset was regenerated (`npm run build-data`) and `src/data` is committed.
- [ ] Editorial decisions changed in `config.py` or `countries.base.json` (explained below).
- [ ] `npm run audit` was re-run and `AUDIT.md` updated.

Data notes / sources:

<!-- e.g. "Ilishan-Remo, NG-OG: https://www.geonames.org/2337693" -->

## API Changes

<!-- Remove this section if the public API is unchanged. -->

- [ ] No public API changes.
- [ ] New methods, options or fields (backward-compatible).
- [ ] Breaking change: existing method signatures, return shapes or codes change.
- [ ] README API reference and `www/app/docs` updated to match.

## Bundle Size

<!--
The package promises small bundles: Countries ~12 kB, States ~77 kB, per-country city
chunks loaded on demand. Report the "Bundle size" table from `npm run audit` when
data or packaging changes. Remove this section if not applicable.
-->

- [ ] No impact on bundle size.
- [ ] Sizes checked with `npm run audit` (before / after below).

Bundle notes:

## Screenshots / Recordings

<!--
Required for website UI changes. Check mobile widths, light and dark themes, and
RTL (ar) where relevant. Remove this section if not applicable.
-->

## Testing

<!-- Describe how the changes were tested and provide the commands used. -->

```bash
cd package
npm run build
npm test
# when data changed:
npm run build-data && npm run audit
# website:
cd ../www && pnpm build
```

- [ ] Package tests pass (ESM and CommonJS builds).
- [ ] Website tested in the browser (pages listed below).

Manual test notes:

## Release

- [ ] No release needed.
- [ ] `package/package.json` version bumped (never reuse a published or unpublished version).
- [ ] `package/CHANGELOG.md` updated.

## Checklist

- [ ] I have reviewed my own changes.
- [ ] The changes do not include unrelated changes or generated artefacts (`dist`, `src/generated`, `.cache`).
- [ ] Codes follow ISO 3166-1 / ISO 3166-2, and time zones are valid IANA names.
- [ ] Data sources keep their attribution (GeoNames CC BY, geoBoundaries CC BY / ODbL).
- [ ] No credentials, tokens or personal data are included.
- [ ] Documentation has been updated where necessary.
- [ ] The changes are backward-compatible, or breaking changes are documented.
