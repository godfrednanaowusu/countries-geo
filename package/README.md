<div align="center">
  <a href="https://countries-geo.vercel.app">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/godfrednanaowusu/countries-geo/blob/main/www/public/logo.png">
      <img alt="Countries Geo logo" src="https://github.com/godfrednanaowusu/countries-geo/blob/main/www/public/logo.png" height="128">
    </picture>
  </a>
  <h1>Countries Geo</h1>

[![Bundle Size](https://img.shields.io/bundlephobia/minzip/countries-geo?logo=npm&style=for-the-badge&labelColor=0000FF)](https://npmjs.com/package/countries-geo)
[![Version](https://img.shields.io/npm/v/countries-geo?logo=npm&style=for-the-badge&labelColor=000000)](https://npmjs.com/package/countries-geo)
[![License](https://img.shields.io/npm/l/countries-geo?logo=npm&style=for-the-badge&labelColor=000000)](https://npmjs.com/package/countries-geo/LICENSE.md)
[![Downloads](https://img.shields.io/npm/dm/countries-geo?logo=npm&style=for-the-badge&labelColor=000000)](https://npmjs.com/package/countries-geo)
[![GitHub Repo stars](https://img.shields.io/github/stars/godfrednanaowusu/countries-geo?style=for-the-badge&logo=github&labelColor=000000)](https://github.com/godfrednanaowusu/countries-geo)
[![GitHub Forks](https://img.shields.io/github/forks/godfrednanaowusu/countries-geo?style=for-the-badge&logo=github&labelColor=000000)](https://github.com/godfrednanaowusu/countries-geo)

</div>

<p align="center">
  Continents, countries, states and cities with ISO codes, geographic centre coordinates, IANA time zones and translations, in a tree-shakable package that only loads the data you use.
</p>

<p align="center">
  <a href="https://countries-geo.vercel.app">Website</a> ·
  <a href="https://countries-geo.vercel.app/docs">Documentation</a> ·
  <a href="./AUDIT.md">Accuracy audit</a> ·
  <a href="./CHANGELOG.md">Changelog</a>
</p>

**Environment:** 🖥️ Node.js 18+ and 🌐 browsers (React, Vue, Svelte, Next.js, Vite, webpack). ESM and CommonJS.

## ✨ Features

- 🌍 **Complete data**: 7 continents, 246 countries and territories, 3,728 states, 231,129 cities
- 🏷️ **Standard codes**: ISO 3166-1 (alpha-2, alpha-3, numeric) and ISO 3166-2, 100% valid
- 📍 **Centre coordinates**: the geographic centre of every continent, country and state; the centre point of every city
- ⏰ **Time zones**: IANA zones for every country, state and city, plus a DST-aware offset helper
- 🌐 **Translations**: 12 languages (en, fr, de, es, pt, ru, zh, ja, ar, hi, bn, pa), loaded only on request
- 🚀 **Small bundles**: `Countries` alone is 12 kB; city data loads one country at a time
- 🔧 **Tree-shakable**: ESM + CommonJS, `sideEffects: false`, only bundle what you import
- 📝 **TypeScript**: full type definitions included
- 🔍 **Audited**: accuracy checked against independent sources, see [AUDIT.md](./AUDIT.md)

### Why Countries Geo?

- ✅ **Accurate**: built from GeoNames, Wikidata, Natural Earth and ISO 3166, with every decision documented and reproducible
- ✅ **Light**: no 8 MB JSON in your bundle; per-country chunks are a median 1.8 kB gzipped
- ✅ **Thorough**: GeoNames' broadest city list, plus Wikidata towns wherever GeoNames coverage is thin (Ghana, Nigeria, DR Congo, ...)
- ✅ **UN-aligned**: country list and names follow ISO 3166 and UN usage

## 📦 Installation

```bash
npm install countries-geo
# or
yarn add countries-geo
# or
pnpm add countries-geo
# or
bun add countries-geo
```

## 🚀 Quick Start

```typescript
import { Continents, Countries, States, Cities, Timezones } from 'countries-geo';

// Countries (synchronous, ~12 kB)
const ghana = Countries.get('GH');
// {
//   iso: 'GH', iso2: 'GH', iso3: 'GHA', numeric: '288', name: 'Ghana',
//   continent: 'AF', phoneCode: '+233',
//   coordinates: { lat: 7.948, lng: -1.217 },
//   timezones: ['Africa/Accra']
// }

// States of a country (synchronous)
const regions = States.getByCountry('GH');
// [{ iso: 'GH-AF', code: 'AF', name: 'Ahafo', type: 'Region', country: 'GH',
//    coordinates: { lat: 6.913, lng: -2.448 }, timezone: 'Africa/Accra', timezones: ['Africa/Accra'] }, ...]

// Cities (asynchronous, loads only that country's chunk)
const cities = await Cities.getByState('GH-AH');
// [{ id: '2298890', name: 'Kumasi', country: 'GH', state: 'GH-AH',
//    coordinates: { lat: 6.688, lng: -1.624 }, timezone: 'Africa/Accra' }, ...]

// Time zones
Timezones.getOffsetString('Africa/Accra'); // '+00:00'
```

```javascript
// CommonJS
const { Countries, Cities } = require('countries-geo');
```

## 📖 API Reference

Every lookup accepts alpha-2 or alpha-3 codes, case-insensitive: `'GH'` / `'GHA'`, `'GH-AA'` / `'GHA-AA'`. Methods that take `options` accept `{ language }` (see [Translations](#-translations)). Lists are sorted by name unless stated otherwise.

### Continents

#### `Continents.getAll`
All continents, sorted by name.
- **Returns:** `Continent[]`

#### `Continents.sortByIsoCode`
All continents, sorted by code.
- **Returns:** `Continent[]`

#### `Continents.get(iso, options?)`
A continent by code (`'AF'` or `'AFR'`).
- **Returns:** `Continent | undefined`

#### `Continents.list(options?)`
All continents, with options.
- **Returns:** `Continent[]`

### Countries

#### `Countries.getAll` / `Countries.sortByIsoCode`
All 246 countries and territories, sorted by name / by ISO code.
- **Returns:** `Country[]`

#### `Countries.get(iso, options?)`
A country by ISO 3166-1 alpha-2 or alpha-3 code.
- **Returns:** `Country | undefined`

#### `Countries.getByContinent(iso, options?)`
Countries of a continent.
- **Returns:** `Country[]`

#### `Countries.list(options?)`
All countries, with options.
- **Returns:** `Country[]`

### States

#### `States.getAll` / `States.sortByIsoCode`
All 3,728 first-level subdivisions, sorted by name / by ISO code.
- **Returns:** `State[]`

#### `States.get(iso, options?)`
A state by ISO 3166-2 code (`'GH-AA'`).
- **Returns:** `State | undefined`

#### `States.getByCountry(iso, options?)`
States of a country.
- **Returns:** `State[]`

#### `States.getByContinent(iso, options?)`
States of every country in a continent.
- **Returns:** `State[]`

#### `States.list(options?)`
All states, with options.
- **Returns:** `State[]`

### Cities

City data is split per country and loaded on demand, so these methods are asynchronous.

#### `Cities.getByCountry(iso, options?)`
Cities of a country.
- **Returns:** `Promise<City[]>`
- **Bundle impact:** one country chunk (median 1.8 kB, largest 246 kB for the USA)

#### `Cities.getByState(iso, options?)`
Cities of a state, by ISO 3166-2 code.
- **Returns:** `Promise<City[]>`
- **Bundle impact:** the chunk of the state's country

#### `Cities.getByContinent(iso, options?)`
Cities of every country in a continent.
- **Returns:** `Promise<City[]>`
- **Warning:** loads every country chunk of that continent

#### `Cities.getAll(options?)`
Every city in the dataset.
- **Returns:** `Promise<City[]>`
- **Warning:** loads all 246 chunks (~4 MB gzipped); prefer the scoped getters

### Timezones

#### `Timezones.getAll`
Every IANA zone referenced by the dataset (418), sorted alphabetically.
- **Returns:** `string[]`

#### `Timezones.getByCountry(iso)` / `Timezones.getByContinent(iso)`
IANA zones of a country (most populous first) or a continent.
- **Returns:** `string[]`

#### `Timezones.getOffset(timeZone, date?)`
UTC offset in minutes at `date` (default: now), daylight saving included. For example, `330` for `Asia/Kolkata`.
- **Returns:** `number`

#### `Timezones.getOffsetString(timeZone, date?)`
UTC offset formatted as `'+05:30'`, `'-04:00'` or `'+00:00'`.
- **Returns:** `string`

### Translations

#### `loadLanguage(language)`
Loads the translations of a language so the synchronous getters can use it. Cities load their translations automatically.
- **Returns:** `Promise<void>`

#### `isLanguageLoaded(language)`
- **Returns:** `boolean`

#### `supportedLanguages`
- **Type:** `Language[]`

## 🔧 TypeScript Types

```typescript
import type { Continent, Country, State, City, Coordinates, Language, Options } from 'countries-geo';
```

| Type | Fields |
| --- | --- |
| `Continent` | `iso`, `iso3`, `name`, `coordinates`, `timezones` |
| `Country` | `iso`, `iso2`, `iso3`, `numeric`, `name`, `continent`, `phoneCode`, `coordinates`, `timezones` |
| `State` | `iso` (e.g. `'GH-AA'`), `code` (`'AA'`), `name`, `type`, `country`, `coordinates`, `timezone`, `timezones` |
| `City` | `id` (GeoNames or Wikidata id), `name`, `country`, `state`, `coordinates`, `timezone` |
| `Coordinates` | `lat`, `lng` |

## 🌐 Translations

Translations are opt-in, so they never weigh on your bundle.

```typescript
import { Countries, Cities, loadLanguage } from 'countries-geo';

await loadLanguage('fr');
Countries.get('DE', { language: 'fr' }).name; // 'Allemagne'

// Cities load their translations together with their data
const cities = await Cities.getByCountry('DE', { language: 'ru' }); // 'Берлин', ...
```

Supported: `en`, `fr`, `de`, `es`, `pt`, `ru`, `zh`, `ja`, `ar`, `hi`, `bn`, `pa`. Names without a translation fall back to English.

## 📍 Coordinates

- **Continents, countries, states**: the geographic centre. This is the area-weighted centroid, computed on an equal-area projection, and it always lies on the territory's own land.
- **Cities**: the city centre point.
- Precision: 3 decimals (about 100 m).

## 📊 Bundle Size

Measured by bundling with esbuild (minified + gzip):

| Import | Initial download |
| --- | --- |
| `Continents` | 4.4 kB |
| `Countries` | 12.2 kB |
| `States` | 77 kB |
| `Cities` (before any country loads) | 16 kB |
| + one country's cities | median 1.8 kB (Ghana 3 kB, Nigeria 15 kB, India 99 kB, USA 246 kB) |

The previous release (0.0.x) shipped a 17.5 MB `data.json` (1.5 MB gzipped) into every import.

## ⬆️ Upgrading from 0.0.x

1.1.0 is a breaking release for 0.0.x users:

- `Cities.*` methods return Promises.
- State `iso` is the full ISO 3166-2 code (`'GH-AA'`); the subdivision part is in `code`.
- Cities have a stable `id` (GeoNames or Wikidata id) instead of an invented `iso`.
- `ns` / `mtd` are replaced by `name` (with the `language` option), `coordinates`, `timezones` and `phoneCode`.

```bash
npm install countries-geo@latest
```

## 🗂️ Data Sources

| Source | Used for | License |
| --- | --- | --- |
| [GeoNames](https://www.geonames.org) | cities, administrative hierarchy, time zones, city translations | CC BY 4.0 |
| [Wikidata](https://www.wikidata.org) | ISO 3166-2 cross-checks, state names, towns GeoNames lacks | CC0 |
| [Natural Earth](https://www.naturalearthdata.com) | country and state boundaries (for centres) | Public domain |
| [geoBoundaries](https://www.geoboundaries.org) | current state boundaries (for centres) | CC BY 4.0 / ODbL by country |
| [Debian iso-codes](https://salsa.debian.org/iso-codes-team/iso-codes) | ISO 3166-1 / 3166-2 codes | LGPL-2.1 |
| [Unicode CLDR](https://cldr.unicode.org) | country names in other languages | Unicode License |
| [IANA tz database](https://www.iana.org/time-zones) | time zone identifiers | Public domain |

Taiwan, Hong Kong and Macao are listed as subdivisions of China (`CN-TW`, `CN-HK`, `CN-MO`), following UN usage.

## 🧪 Testing and Rebuilding the Data

```bash
npm test             # API tests against the ESM and CommonJS builds

npm run fetch-data   # download the upstream sources
npm run build-data   # rebuild src/data
npm run build        # compile the package
npm run audit        # regenerate AUDIT.md
```

See [`scripts/build-data`](./scripts/build-data) for how every field is produced.

## 🤝 Contributing

Contributions to Countries Geo are welcome and highly appreciated. Please review our [Contribution Guidelines](/contributing.md) first.

**Missing a town?** Add it to [`scripts/build-data/cities.additions.json`](./scripts/build-data/cities.additions.json) with a short note, or [open an issue](https://github.com/godfrednanaowusu/countries-geo/issues).

## 💛 Support Countries Geo

If Countries Geo saves you time, you can support its development:

<a href="https://buymeacoffee.com/godfredowusu"><img src="https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=000000" alt="Buy me a coffee"></a>

## 📄 License

MIT © [Godfred Nana Owusu](https://github.com/godfrednanaowusu)

The bundled data keeps the attribution its sources require (see [Data Sources](#️-data-sources)).
