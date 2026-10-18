import continentRows from './generated/continents.js';
import countryRows from './generated/countries.js';
import { cities as loaders, cityTranslations } from './generated/loaders.js';
import { isLanguageLoaded, loadLanguage } from './internal/i18n.js';
import { timezoneNames } from './internal/timezones.js';
import { byName, normalizeCode } from './internal/util.js';
import type { City, Language, Options } from './types.js';

// One file per country, columnar: state codes, ids, names, run-length state / time zone indexes and
// delta-encoded coordinates (integers scaled by 10^PRECISION).
interface CityFile {
  c: string[];
  i: number[];
  n: string[];
  s: number[];
  y: number[];
  x: number[];
  z: number[];
}

interface Decoded {
  country: string;
  ids: string[];
  names: string[];
  states: (string | null)[];
  lat: number[];
  lng: number[];
  zones: string[];
}

type Loader<T> = () => Promise<{ default: T }>;

const SCALE = 1000;
const countries = countryRows as [string, string, string, string, number][];
const continents = continentRows as [string, string][];
const cityLoaders = loaders as Record<string, Loader<CityFile> | undefined>;
const translationIndexes = cityTranslations as Record<string, Loader<Record<string, Loader<[number[], string[]]> | undefined>> | undefined>;

const unrle = (pairs: number[]): number[] => {
  const out: number[] = [];
  for (let i = 0; i < pairs.length; i += 2) for (let n = 0; n < pairs[i + 1]; n++) out.push(pairs[i]);
  return out;
};

const undelta = (values: number[]): number[] => {
  let acc = 0;
  return values.map((v) => (acc += v) / SCALE);
};

const decoded = new Map<string, Promise<Decoded>>();
const translations = new Map<string, Promise<Map<number, string>>>();

const decode = (country: string): Promise<Decoded> => {
  let promise = decoded.get(country);
  if (!promise) {
    const load = cityLoaders[country];
    promise = load
      ? load().then(({ default: file }) => ({
          country,
          ids: file.i.map((id) => (id < 0 ? `Q${-id}` : String(id))),
          names: file.n,
          states: unrle(file.s).map((s) => (s < 0 ? null : `${country}-${file.c[s]}`)),
          lat: undelta(file.y),
          lng: undelta(file.x),
          zones: unrle(file.z).map((z) => timezoneNames[z]),
        }))
      : Promise.resolve({ country, ids: [], names: [], states: [], lat: [], lng: [], zones: [] });
    decoded.set(country, promise);
    promise.catch(() => decoded.delete(country));
  }
  return promise;
};

const translate = (country: string, language?: Language): Promise<Map<number, string> | undefined> => {
  if (!language || language === 'en') return Promise.resolve(undefined);
  const key = `${language}/${country}`;
  let promise = translations.get(key);
  if (!promise) {
    const loadIndex = translationIndexes[language];
    promise = loadIndex
      ? loadIndex().then(async ({ default: chunks }) => {
          const load = chunks[country];
          if (!load) return new Map<number, string>();
          const { default: [indexes, names] } = await load();
          return new Map(indexes.map((idx, i) => [idx, names[i]]));
        })
      : Promise.resolve(new Map<number, string>());
    translations.set(key, promise);
  }
  return promise;
};

const resolveCountry = (iso: string): string | undefined => {
  const code = normalizeCode(iso);
  return countries.find((c) => c[0] === code || c[1] === code)?.[0];
};

const materialize = async (country: string, options?: Options, state?: string): Promise<City[]> => {
  const language = options?.language;
  if (language && !isLanguageLoaded(language)) await loadLanguage(language);
  const [data, names] = await Promise.all([decode(country), translate(country, language)]);
  const out: City[] = [];
  for (let i = 0; i < data.ids.length; i++) {
    if (state && data.states[i] !== state) continue;
    out.push({
      id: data.ids[i],
      name: names?.get(i) ?? data.names[i],
      country,
      state: data.states[i],
      coordinates: { lat: data.lat[i], lng: data.lng[i] },
      timezone: data.zones[i],
    });
  }
  return out;
};

/** Cities of a country ("GH" or "GHA"), sorted by name. Loads only that country's data. */
const getByCountry = async (iso: string, options?: Options): Promise<City[]> => {
  const country = resolveCountry(iso);
  return country ? byName(await materialize(country, options), options?.language) : [];
};

/** Cities of a state by ISO 3166-2 code ("GH-AA"), sorted by name. */
const getByState = async (iso: string, options?: Options): Promise<City[]> => {
  const [countryPart, code] = normalizeCode(iso).split('-');
  const country = resolveCountry(countryPart ?? '');
  if (!country || !code) return [];
  return byName(await materialize(country, options, `${country}-${code}`), options?.language);
};

/** Cities of every country in a continent ("AF" or "AFR"), sorted by name. */
const getByContinent = async (iso: string, options?: Options): Promise<City[]> => {
  const code = normalizeCode(iso);
  const continent = continents.findIndex((c) => c[0] === code || c[1] === code);
  if (continent < 0) return [];
  const lists = await Promise.all(countries.filter((c) => c[4] === continent).map((c) => materialize(c[0], options)));
  return byName(lists.flat(), options?.language);
};

/** Every city in the dataset, sorted by name. Loads all countries: prefer the scoped getters. */
const getAll = async (options?: Options): Promise<City[]> => {
  const lists = await Promise.all(countries.map((c) => materialize(c[0], options)));
  return byName(lists.flat(), options?.language);
};

export default {
  getAll,
  getByCountry,
  getByState,
  getByContinent,
};
