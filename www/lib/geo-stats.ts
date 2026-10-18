import { Cities, Continents, Countries, States, supportedLanguages } from "countries-geo";

export type GeoStats = {
  continents: number;
  countries: number;
  states: number;
  cities: number;
  languages: number;
  timezones: number;
};

let stats: Promise<GeoStats> | undefined;

// Counted from the package at build time (server only), so the numbers never go stale
// and the city data never reaches the client bundle. Memoised across components.
export const getGeoStats = (): Promise<GeoStats> =>
  (stats ??= Cities.getAll().then((cities) => {
    const countries = Countries.list();
    return {
      continents: Continents.list().length,
      countries: countries.length,
      states: States.list().length,
      cities: cities.length,
      languages: supportedLanguages.length,
      timezones: new Set(countries.flatMap((country) => country.timezones)).size,
    };
  }));
