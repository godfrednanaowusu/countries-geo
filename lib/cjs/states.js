"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
// Get a list of all states.
const getAll = (_a = (0, utils_1.states)()) === null || _a === void 0 ? void 0 : _a.sort((a, b) => a.name.localeCompare(b.name));
// Get an isoCode sorted states
const sortByIsoCode = (_b = (0, utils_1.states)()) === null || _b === void 0 ? void 0 : _b.sort((a, b) => a.iso.localeCompare(b.iso));
// Get a country filtered states
const getByCountry = (iso) => (0, utils_1.states_by_country)(iso);
// Get a continent filtered states
const getByContinent = (iso) => (0, utils_1.states_by_continent)(iso);
exports.default = {
    getAll,
    sortByIsoCode,
    getByCountry,
    getByContinent
};
// import stateList from './assets/state.json';
// import { findEntryByCode, findStateByCodeAndCountryCode, compare } from './utils';
// import { IState } from './types';
// // Get a list of all states.
// export function getAllStates(): IState[] {
// 	return stateList;
// }
// // Get a list of states belonging to a specific country.
// export function getStatesOfCountry(countryCode: string = ''): IState[] {
// 	if (!countryCode) return [];
// 	// get data from file or cache
// 	const states = stateList.filter((value) => {
// 		return value.countryCode === countryCode;
// 	});
// 	return states.sort(compare);
// }
// export function getStateByCodeAndCountry(stateCode: string, countryCode: string): IState | undefined {
// 	if (!stateCode) return undefined;
// 	if (!countryCode) return undefined;
// 	return findStateByCodeAndCountryCode(stateList, stateCode, countryCode);
// }
// // to be deprecate
// export function getStateByCode(isoCode: string): IState | undefined {
// 	// eslint-disable-next-line no-console
// 	console.warn(
// 		`WARNING! 'getStateByCode' has been deprecated, please use the new 'getStateByCodeAndCountry' function instead!`,
// 	);
// 	if (!isoCode) return undefined;
// 	return findEntryByCode(stateList, isoCode);
// }
// function sortByIsoCode(countries: IState[]): IState[] {
// 	return countries.sort((a, b) => {
// 		return compare<IState>(a, b, (entity) => {
// 			return `${entity.countryCode}-${entity.isoCode}`;
// 		});
// 	});
// }
// export default {
// 	getAllStates,
// 	getStatesOfCountry,
// 	getStateByCodeAndCountry,
// 	getStateByCode,
// 	sortByIsoCode,
// };
