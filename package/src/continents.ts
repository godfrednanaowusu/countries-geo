import raw from './generated/continents.js';
import { translate } from './internal/i18n.js';
import { zoneList } from './internal/timezones.js';
import { byIso, byName, normalizeCode } from './internal/util.js';
import type { Continent, Options } from './types.js';

type Row = [iso: string, iso3: string, name: string, lat: number, lng: number, zones: number[]];

const rows = raw as Row[];

const build = (row: Row, language?: Options['language']): Continent => ({
  iso: row[0],
  iso3: row[1],
  name: translate('continents', row[0], row[2], language),
  coordinates: { lat: row[3], lng: row[4] },
  timezones: zoneList(row[5]),
});

/** All continents, sorted by name. */
const list = (options?: Options): Continent[] => byName(rows.map((r) => build(r, options?.language)), options?.language);

/** A continent by its two- or three-letter code ("AF" or "AFR"). */
const get = (iso: string, options?: Options): Continent | undefined => {
  const code = normalizeCode(iso);
  const row = rows.find((r) => r[0] === code || r[1] === code);
  return row && build(row, options?.language);
};

export default {
  /** All continents sorted by name (English). */
  get getAll(): Continent[] {
    return list();
  },
  /** All continents sorted by ISO code. */
  get sortByIsoCode(): Continent[] {
    return byIso(rows.map((r) => build(r)));
  },
  list,
  get,
};
