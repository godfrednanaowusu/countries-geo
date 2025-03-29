import data from '../data.json'
import { TState, TCity } from './interface';

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