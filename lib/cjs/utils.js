"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cities_by_continent = exports.cities_by_country = exports.cities_by_state = exports.cities = exports.states_by_continent = exports.states_by_country = exports.states = exports.countries_by_continent = exports.countries = exports.continents = void 0;
const data_json_1 = __importDefault(require("./data.json"));
// Continents
const continents = () => data_json_1.default === null || data_json_1.default === void 0 ? void 0 : data_json_1.default.map(({ i, n }) => ({ iso: i, name: n }));
exports.continents = continents;
// Countries
const countries = () => data_json_1.default === null || data_json_1.default === void 0 ? void 0 : data_json_1.default.flatMap(continent => { var _a; return (_a = continent === null || continent === void 0 ? void 0 : continent.cn) === null || _a === void 0 ? void 0 : _a.map(country => ({ iso: country.i, name: country.n })); });
exports.countries = countries;
const countries_by_continent = (iso) => {
    var _a;
    try {
        const continent = data_json_1.default === null || data_json_1.default === void 0 ? void 0 : data_json_1.default.find(c => c.i === iso);
        if (!continent)
            return [];
        return (_a = continent === null || continent === void 0 ? void 0 : continent.cn) === null || _a === void 0 ? void 0 : _a.map(country => ({
            iso: country.i,
            name: country.n
        }));
    }
    catch (e) {
        return [];
    }
};
exports.countries_by_continent = countries_by_continent;
// States
const states = () => data_json_1.default.flatMap(continent => continent.cn).map(state => ({ iso: state.i, name: state.n }));
exports.states = states;
const states_by_country = (iso) => {
    try {
        for (const continent of data_json_1.default) {
            const country = continent.cn.find(c => c.i === iso);
            if (country === null || country === void 0 ? void 0 : country.s) {
                return country.s.map(state => ({ iso: state.i, name: state.n }));
            }
        }
        return [];
    }
    catch (e) {
        return [];
    }
};
exports.states_by_country = states_by_country;
const states_by_continent = (iso) => {
    try {
        const continent = data_json_1.default.find(c => c.i === iso);
        if (!continent)
            return [];
        return continent.cn
            .flatMap(country => country.s || [])
            .map(state => ({ iso: state.i, name: state.n }));
    }
    catch (e) {
        return [];
    }
};
exports.states_by_continent = states_by_continent;
// Cities
const cities = () => data_json_1.default.flatMap(continent => continent.cn).flatMap(country => country.s || []).flatMap(state => state.c || []).map(city => ({ iso: city.i, name: city.n }));
exports.cities = cities;
const cities_by_state = (iso) => {
    try {
        // Validate input format (e.g., 'GH-AA')
        if (!iso || typeof iso !== 'string' || iso.split('-').length !== 2) {
            return [];
        }
        const [countryIso, stateIso] = iso.split('-');
        // Safely traverse the data structure
        if (!data_json_1.default || !Array.isArray(data_json_1.default))
            return [];
        for (const continent of data_json_1.default) {
            if (!continent.cn || !Array.isArray(continent.cn))
                continue;
            for (const country of continent.cn) {
                if (country.i === countryIso) {
                    // Check if states exist and are iterable
                    if (!country.s || !Array.isArray(country.s))
                        return [];
                    const state = country.s.find(s => s.i === stateIso);
                    // Check if cities exist and are iterable
                    if ((state === null || state === void 0 ? void 0 : state.c) && Array.isArray(state.c)) {
                        return state.c.map(city => ({
                            iso: `${countryIso}-${stateIso}-${city.i}`,
                            name: city.n
                        }));
                    }
                    return []; // State found but no cities
                }
            }
        }
        return []; // No matching country/state found
    }
    catch (error) {
        console.error('Error in cities_by_state:', error);
        return [];
    }
};
exports.cities_by_state = cities_by_state;
const cities_by_country = (iso) => {
    var _a, _b, _c;
    try {
        return ((_c = (_b = (_a = data_json_1.default
            .flatMap(continent => continent.cn)
            .find(country => country.i === iso)) === null || _a === void 0 ? void 0 : _a.s) === null || _b === void 0 ? void 0 : _b.flatMap(state => state.c || [])) === null || _c === void 0 ? void 0 : _c.map(city => ({ iso: city.i, name: city.n }))) || [];
    }
    catch (e) {
        return [];
    }
};
exports.cities_by_country = cities_by_country;
const cities_by_continent = (iso) => {
    try {
        const continent = data_json_1.default.find(c => c.i === iso);
        if (!continent)
            return [];
        return continent.cn
            .flatMap(country => country.s || [])
            .flatMap(state => state.c || [])
            .map(city => ({ iso: city.i, name: city.n }));
    }
    catch (e) {
        return [];
    }
};
exports.cities_by_continent = cities_by_continent;
