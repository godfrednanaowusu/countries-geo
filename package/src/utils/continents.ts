import data from '../data.json';
import { TContinent } from './interface';

// Continents
export const continents = (): TContinent[] => data?.map(({ i, n }) => ({iso: i, name: n}));
