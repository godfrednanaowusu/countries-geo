import data from './data.json';
import { TContinent, TCountry, TState, TCity } from './types';

// Continents
export const continents = (): TContinent[] => data?.map(({ i, n }) => ({iso: i, name: n}));

// Countries
export const countries = (): TCountry[] => data?.flatMap(continent => continent?.cn?.map(country => ({ iso: country.i, name: country.n })));
export const countries_by_continent = (iso: string): TCountry[] => {
  try{  
  const continent = data?.find(c => c.i === iso);
    if (!continent) return [];
    return continent?.cn?.map(country => ({
      iso: country.i,
      name: country.n
    }));
  }catch(e){
    return []
  }
};

// States
export const states = (): TState[] => data.flatMap(continent => continent.cn).map(state => ({ iso: state.i, name: state.n }));
export const states_by_country = (iso: string) => {
  try{
    for (const continent of data) {
      const country = continent.cn.find(c => c.i === iso);
      if (country?.s) {
        return country.s.map(state => ({ iso: state.i, name: state.n }));
      }
    }
    return [];
  }catch(e){
    return []
  }
};
  export const states_by_continent = (iso: string) => {
    try{
    const continent = data.find(c => c.i === iso);
    if (!continent) return [];
    return continent.cn
      .flatMap(country => country.s || [])
      .map(state => ({ iso: state.i, name: state.n }));
    }catch(e){
        return []
      }
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
  try{
    return data
    .flatMap(continent => continent.cn)
    .find(country => country.i === iso)
    ?.s?.flatMap(state => state.c || [])
    ?.map(city => ({ iso: city.i, name: city.n })) || [];
  }catch(e){
    return []
  }
};

export const cities_by_continent = (iso: string): TCity[] => {
  try{
  const continent = data.find(c => c.i === iso);
  if (!continent) return [];
  
  return continent.cn
    .flatMap(country => country.s || [])
    .flatMap(state => state.c || [])
    .map(city => ({ iso: city.i, name: city.n }));
  }catch(e){
    return []
  }
};


