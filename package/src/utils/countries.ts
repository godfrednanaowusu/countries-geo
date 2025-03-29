import data from '../data.json';
import {  TCountry } from './interface';

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