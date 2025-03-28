"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
// Get a list of all countries.
const getAll = (_a = (0, utils_1.countries)()) === null || _a === void 0 ? void 0 : _a.sort((a, b) => a.name.localeCompare(b.name));
// Get an isoCode sorted countries
const sortByIsoCode = (_b = (0, utils_1.countries)()) === null || _b === void 0 ? void 0 : _b.sort((a, b) => a.iso.localeCompare(b.iso));
// Get a continent filtered countries
const getByContinent = (iso) => (0, utils_1.countries_by_continent)(iso);
exports.default = {
    getAll,
    sortByIsoCode,
    getByContinent,
};
