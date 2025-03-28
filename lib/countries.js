var _a, _b;
import { countries, countries_by_continent } from './utils';
// Get a list of all countries.
const getAll = (_a = countries()) === null || _a === void 0 ? void 0 : _a.sort((a, b) => a.name.localeCompare(b.name));
// Get an isoCode sorted countries
const sortByIsoCode = (_b = countries()) === null || _b === void 0 ? void 0 : _b.sort((a, b) => a.iso.localeCompare(b.iso));
// Get a continent filtered countries
const getByContinent = (iso) => countries_by_continent(iso);
export default {
    getAll,
    sortByIsoCode,
    getByContinent,
};
