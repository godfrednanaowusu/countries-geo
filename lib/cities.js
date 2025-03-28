var _a, _b;
import { cities, cities_by_country, cities_by_state, cities_by_continent } from './utils';
// Get a list of all cities.
const getAll = (_a = cities()) === null || _a === void 0 ? void 0 : _a.sort((a, b) => a.name.localeCompare(b.name));
// Get an isoCode sorted cities
const sortByIsoCode = (_b = cities()) === null || _b === void 0 ? void 0 : _b.sort((a, b) => a.iso.localeCompare(b.iso));
// Get a state filtered cities
const getByState = (iso) => cities_by_state(iso);
// Get a country filtered cities
const getByCountry = (iso) => cities_by_country(iso);
// Get a continent filtered cities
const getByContinent = (iso) => cities_by_continent(iso);
export default {
    getAll,
    sortByIsoCode,
    getByCountry,
    getByState,
    getByContinent
};
