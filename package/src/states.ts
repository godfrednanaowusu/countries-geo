import continentRows from './generated/continents.js';
import countryRows from './generated/countries.js';
import raw from './generated/states.js';
import { translate } from './internal/i18n.js';
import { zoneList } from './internal/timezones.js';
import { byIso, byName, normalizeCode } from './internal/util.js';
import type { Options, State } from './types.js';

type Row = [country: number, code: string, name: string, type: number, lat: number | null, lng: number | null, zones: number[]];

const { types, states: rows } = raw as { types: string[]; states: Row[] };
const countries = countryRows as [string, string, string, string, number][];
const continents = continentRows as [string, string][];

const build = (row: Row, language?: Options['language']): State => {
  const country = countries[row[0]][0];
  const iso = `${country}-${row[1]}`;
  const timezones = zoneList(row[6]);
  return {
    iso,
    code: row[1],
    name: translate('states', iso, row[2], language),
    type: types[row[3]],
    country,
    coordinates: row[4] === null || row[5] === null ? null : { lat: row[4], lng: row[5] },
    timezone: timezones[0],
    timezones,
  };
};

const countryIndex = (iso: string): number => {
  const code = normalizeCode(iso);
  return countries.findIndex((c) => c[0] === code || c[1] === code);
};

/** All states, sorted by name. */
const list = (options?: Options): State[] => byName(rows.map((r) => build(r, options?.language)), options?.language);

/** A state by its ISO 3166-2 code ("GH-AA"); the country part may be alpha-3 ("GHA-AA"). */
const get = (iso: string, options?: Options): State | undefined => {
  const [country, code] = normalizeCode(iso).split('-');
  const index = countryIndex(country);
  const row = rows.find((r) => r[0] === index && r[1] === code);
  return row && build(row, options?.language);
};

/** States of a country ("GH" or "GHA"), sorted by name. */
const getByCountry = (iso: string, options?: Options): State[] => {
  const index = countryIndex(iso);
  if (index < 0) return [];
  return byName(rows.filter((r) => r[0] === index).map((r) => build(r, options?.language)), options?.language);
};

/** States of every country in a continent ("AF" or "AFR"), sorted by name. */
const getByContinent = (iso: string, options?: Options): State[] => {
  const code = normalizeCode(iso);
  const continent = continents.findIndex((c) => c[0] === code || c[1] === code);
  if (continent < 0) return [];
  return byName(
    rows.filter((r) => countries[r[0]][4] === continent).map((r) => build(r, options?.language)),
    options?.language,
  );
};

export default {
  /** All states sorted by name (English). */
  get getAll(): State[] {
    return list();
  },
  /** All states sorted by ISO code. */
  get sortByIsoCode(): State[] {
    return byIso(rows.map((r) => build(r)));
  },
  list,
  get,
  getByCountry,
  getByContinent,
};
