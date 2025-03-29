import { continents } from '../utils';

// Get a list of all continents.
const getAll = continents()?.sort((a, b) => a.name.localeCompare(b.name));

// Get an isoCode sorted continents
const sortByIsoCode = continents()?.sort((a, b) => a.iso.localeCompare(b.iso));

export default { getAll, sortByIsoCode };