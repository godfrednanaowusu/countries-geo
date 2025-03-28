"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
// Get a list of all cities.
const getAll = (_a = (0, utils_1.cities)()) === null || _a === void 0 ? void 0 : _a.sort((a, b) => a.name.localeCompare(b.name));
// Get an isoCode sorted cities
const sortByIsoCode = (_b = (0, utils_1.cities)()) === null || _b === void 0 ? void 0 : _b.sort((a, b) => a.iso.localeCompare(b.iso));
// Get a state filtered cities
const getByState = (iso) => (0, utils_1.cities_by_state)(iso);
// Get a country filtered cities
const getByCountry = (iso) => (0, utils_1.cities_by_country)(iso);
// Get a continent filtered cities
const getByContinent = (iso) => (0, utils_1.cities_by_continent)(iso);
exports.default = {
    getAll,
    sortByIsoCode,
    getByCountry,
    getByState,
    getByContinent
};
