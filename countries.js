import { countries, countries_by_continent } from './utils';

// Get a list of all countries.
const getAll = countries()?.sort((a, b) => a.name.localeCompare(b.name));

// Get an isoCode sorted countries
const sortByIsoCode = countries()?.sort((a, b) => a.iso.localeCompare(b.iso));

// Get a continent filtered countries
const getByContinent = (iso) => countries_by_continent(iso)

export default {
	getAll,
	sortByIsoCode,
    getByContinent,
};

