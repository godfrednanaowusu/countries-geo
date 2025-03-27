import data from './data.json' assert { type: 'json' };
import { TContinent, TCountry, ICountry, IState, ICity, TState, TCity } from './types';

// Continents
export const continents = (): TContinent[] => data?.map(({ i, n }) => ({iso: i, name: n}));

// Countries
export const countries = (): TCountry[] => data?.flatMap(continent => continent?.cn?.map(country => ({ iso: country.i, name: country.n })));
export const countries_by_continent = (iso: string): TCountry[] => {
    const continent = data?.find(c => c.i === iso);
    if (!continent) return [];
    return continent?.cn?.map(country => ({
      iso: country.i,
      name: country.n
    }));
};

// States
export const states = (): TState[] => data.flatMap(continent => continent.cn).map(state => ({ iso: state.i, name: state.n }));
export const states_by_country = (iso: string) => {
    for (const continent of data) {
      const country = continent.cn.find(c => c.i === iso);
      if (country?.s) {
        return country.s.map(state => ({ iso: state.i, name: state.n }));
      }
    }
    return [];
};
  export const states_by_continent = (iso: string) => {
    const continent = data.find(c => c.i === iso);
    if (!continent) return [];
    return continent.cn
      .flatMap(country => country.s || [])
      .map(state => ({ iso: state.i, name: state.n }));
};


// Cities
export const cities = (): TCity[] => data.flatMap(continent => continent.cn).flatMap(country => country.s || []).flatMap(state => state.c || []).map(city => ({ iso: city.i, name: city.n }));

export const cities_by_state = (iso: string): TCity[] => {
  try {
      // Validate input format (e.g., 'GH-AA')
      if (!iso || typeof iso !== 'string' || iso.split('-').length !== 2) {
          return [];
      }

      const [countryIso, stateIso] = iso.split('-');
      
      // Safely traverse the data structure
      if (!data || !Array.isArray(data)) return [];
      
      for (const continent of data) {
          if (!continent.cn || !Array.isArray(continent.cn)) continue;
          
          for (const country of continent.cn) {
              if (country.i === countryIso) {
                  // Check if states exist and are iterable
                  if (!country.s || !Array.isArray(country.s)) return [];
                  
                  const state = country.s.find(s => s.i === stateIso);
                  // Check if cities exist and are iterable
                  if (state?.c && Array.isArray(state.c)) {
                      return state.c.map(city => ({
                          iso: `${countryIso}-${stateIso}-${city.i}`,
                          name: city.n
                      }));
                  }
                  return []; // State found but no cities
              }
          }
      }
      return []; // No matching country/state found
  } catch (error) {
      console.error('Error in cities_by_state:', error);
      return [];
  }
};

export const cities_by_country = (iso: string): TCity[] => {
    return data
    .flatMap(continent => continent.cn)
    .find(country => country.i === iso)
    ?.s?.flatMap(state => state.c || [])
    ?.map(city => ({ iso: city.i, name: city.n })) || [];
};

export const cities_by_continent = (iso: string): TCity[] => {
    const continent = data.find(c => c.i === iso);
  if (!continent) return [];
  
  return continent.cn
    .flatMap(country => country.s || [])
    .flatMap(state => state.c || [])
    .map(city => ({ iso: city.i, name: city.n }));
};



// export const findEntryByCode = (source: any, code: string) => {
// 	if (code && source != null) {
// 		const codex = source.findIndex((c: any) => {
// 			return c.isoCode === code;
// 		});
// 		return codex !== -1 ? source[codex] : undefined;
// 	}
// 	return undefined;
// };

// export const findStateByCodeAndCountryCode = (source: any, code: string, countryCode: string) => {
// 	if (code && countryCode && source != null) {
// 		const codex = source.findIndex((c: any) => {
// 			return c.isoCode === code && c.countryCode === countryCode;
// 		});
// 		return codex !== -1 ? source[codex] : undefined;
// 	}
// 	return undefined;
// };

// export function defaultKeyToCompare<T extends ICountry | IState | ICity>(entity: T) {
// 	return entity.name;
// }

// export const compare = <T extends ICountry | IState | ICity>(
// 	a: T,
// 	b: T,
// 	// eslint-disable-next-line no-unused-vars
// 	keyToCompare: (entity: T) => string = defaultKeyToCompare,
// ) => {
// 	if (keyToCompare(a) < keyToCompare(b)) return -1;
// 	if (keyToCompare(a) > keyToCompare(b)) return 1;
// 	return 0;
// };

// export const convertArrayToObject = (keys: string[], arr: string[][]): ICity[] => {
// 	const result = arr.map((subArr) => {
// 		return Object.fromEntries(keys.map((key, index) => [key, subArr[index]]))
// 	})

// 	return (result as unknown as ICity[]);
// }