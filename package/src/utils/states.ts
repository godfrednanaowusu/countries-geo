import data from '../data/en.json'
import { TState, TCity } from './interface';

// States
export const states = (): TState[] => data.flatMap((continent:any) => continent.cn.flatMap((country:any) => country.s || [])).filter((state:any) => state.i).map((state:any) => ({ iso: state.i, name: state.n }));
export const states_by_country = (iso: string) => {
    for (const continent of data) {
      const country = continent.cn.find(c => c.i === iso);
      if (country?.s) {
        return country.s.filter((state:any) => state.i).map((state:any) => ({ iso: state.i, name: state.n }));
      }
    }
    return [];
};
  export const states_by_continent = (iso: string) => {
    const continent = data.find(c => c.i === iso);
    if (!continent) return [];
    return continent.cn
      .flatMap((country:any) => country.s || [])
      .filter((state:any) => state.i)
      .map((state:any) => ({ iso: state.i, name: state.n }));
};