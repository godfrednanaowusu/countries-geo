import { states, states_by_continent, states_by_country } from './utils/states';

// Get a list of all states.
const getAll = states()?.sort((a, b) => a.name.localeCompare(b.name));

// Get an isoCode sorted states
const sortByIsoCode = states()?.sort((a, b) => a.iso.localeCompare(b.iso));

// Get a country filtered states
const getByCountry = (iso:string) => states_by_country(iso)

// Get a continent filtered states
const getByContinent = (iso:string) => states_by_continent(iso)

export default {
    getAll,
    sortByIsoCode,
    getByCountry,
    getByContinent
};

