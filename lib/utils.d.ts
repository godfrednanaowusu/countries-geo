import { TContinent, TCountry, TState, TCity } from './types';
export declare const continents: () => TContinent[];
export declare const countries: () => TCountry[];
export declare const countries_by_continent: (iso: string) => TCountry[];
export declare const states: () => TState[];
export declare const states_by_country: (iso: string) => {
    iso: string;
    name: string;
}[];
export declare const states_by_continent: (iso: string) => {
    iso: string;
    name: string;
}[];
export declare const cities: () => TCity[];
export declare const cities_by_state: (iso: string) => TCity[];
export declare const cities_by_country: (iso: string) => TCity[];
export declare const cities_by_continent: (iso: string) => TCity[];
