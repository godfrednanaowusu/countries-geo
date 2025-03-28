var _a, _b;
import { continents } from './utils';
// Get a list of all continents.
const getAll = (_a = continents()) === null || _a === void 0 ? void 0 : _a.sort((a, b) => a.name.localeCompare(b.name));
// Get an isoCode sorted continents
const sortByIsoCode = (_b = continents()) === null || _b === void 0 ? void 0 : _b.sort((a, b) => a.iso.localeCompare(b.iso));
export default { getAll, sortByIsoCode };
