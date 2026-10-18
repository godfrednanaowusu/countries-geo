import continentRows from './generated/continents.js';
import raw from './generated/countries.js';
import { translate } from './internal/i18n.js';
import { zoneList } from './internal/timezones.js';
import { byIso, byName, normalizeCode } from './internal/util.js';
import type { Country, Options } from './types.js';

type Row = [
  iso2: string, iso3: string, numeric: string, name: string, continent: number, phone: string,
  lat: number, lng: number, zones: number[],
];

const rows = raw as Row[];
const continentCodes = (continentRows as [string, string][]).map((c) => [c[0], c[1]] as const);

const build = (row: Row, language?: Options['language']): Country => ({
  iso: row[0],
  iso2: row[0],
  iso3: row[1],
  numeric: row[2],
  name: translate('countries', row[0], row[3], language),
  continent: continentCodes[row[4]][0],
  phoneCode: row[5],
  coordinates: { lat: row[6], lng: row[7] },
  timezones: zoneList(row[8]),
});

/** All countries, sorted by name. */
const list = (options?: Options): Country[] => byName(rows.map((r) => build(r, options?.language)), options?.language);

/** A country by its ISO 3166-1 alpha-2 or alpha-3 code ("GH" or "GHA"). */
const get = (iso: string, options?: Options): Country | undefined => {
  const code = normalizeCode(iso);
  const row = rows.find((r) => r[0] === code || r[1] === code);
  return row && build(row, options?.language);
};

/** Countries of a continent ("AF" or "AFR"), sorted by name. */
const getByContinent = (iso: string, options?: Options): Country[] => {
  const code = normalizeCode(iso);
  const index = continentCodes.findIndex((c) => c[0] === code || c[1] === code);
  if (index < 0) return [];
  return byName(rows.filter((r) => r[4] === index).map((r) => build(r, options?.language)), options?.language);
};

export default {
  /** All countries sorted by name (English). */
  get getAll(): Country[] {
    return list();
  },
  /** All countries sorted by ISO code. */
  get sortByIsoCode(): Country[] {
    return byIso(rows.map((r) => build(r)));
  },
  list,
  get,
  getByContinent,
};
