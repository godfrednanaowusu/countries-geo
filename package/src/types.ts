/** Languages with bundled translations. English is always available. */
export type Language = 'en' | 'fr' | 'de' | 'es' | 'pt' | 'ru' | 'zh' | 'ja' | 'ar' | 'hi' | 'bn' | 'pa';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Options {
  /** Language for `name`. Call `loadLanguage()` first for anything other than English. */
  language?: Language;
}

export interface Continent {
  /** Two-letter continent code, e.g. "AF". */
  iso: string;
  iso3: string;
  name: string;
  /** Geographic centre of the continent. */
  coordinates: Coordinates;
  /** Every IANA time zone used in the continent. */
  timezones: string[];
}

export interface Country {
  /** ISO 3166-1 alpha-2 code, e.g. "GH". */
  iso: string;
  iso2: string;
  /** ISO 3166-1 alpha-3 code, e.g. "GHA". */
  iso3: string;
  /** ISO 3166-1 numeric code, e.g. "288". */
  numeric: string;
  name: string;
  /** Continent code, e.g. "AF". */
  continent: string;
  /** International dialling prefix, e.g. "+233" or "+1-876". Empty when none exists. */
  phoneCode: string;
  /** Geographic centre of the country. */
  coordinates: Coordinates;
  /** IANA time zones, most populous first. */
  timezones: string[];
}

export interface State {
  /** Full ISO 3166-2 code, e.g. "GH-AA". */
  iso: string;
  /** Subdivision part of the code, e.g. "AA". */
  code: string;
  name: string;
  /** Subdivision category as published in ISO 3166-2, e.g. "Region", "Province", "County". */
  type: string;
  /** ISO 3166-1 alpha-2 code of the country. */
  country: string;
  /** Geographic centre of the subdivision. */
  coordinates: Coordinates | null;
  /** Main IANA time zone (the one most of its population lives in). */
  timezone: string;
  /** All IANA time zones observed in the subdivision, most populous first. */
  timezones: string[];
}

export interface City {
  /** Stable identifier: a GeoNames id ("2306104") or a Wikidata id ("Q3780479"). */
  id: string;
  name: string;
  /** ISO 3166-1 alpha-2 code of the country. */
  country: string;
  /** ISO 3166-2 code of the state, or null for countries without subdivisions. */
  state: string | null;
  /** City centre. */
  coordinates: Coordinates;
  /** IANA time zone. */
  timezone: string;
}
