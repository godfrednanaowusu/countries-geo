"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
// Get a list of all continents.
const getAll = (_a = (0, utils_1.continents)()) === null || _a === void 0 ? void 0 : _a.sort((a, b) => a.name.localeCompare(b.name));
// Get an isoCode sorted continents
const sortByIsoCode = (_b = (0, utils_1.continents)()) === null || _b === void 0 ? void 0 : _b.sort((a, b) => a.iso.localeCompare(b.iso));
exports.default = { getAll, sortByIsoCode };
