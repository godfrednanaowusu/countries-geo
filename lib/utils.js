import data from './data.json';
// Continents
export const continents = () => data === null || data === void 0 ? void 0 : data.map(({ i, n }) => ({ iso: i, name: n }));
// Countries
export const countries = () => data === null || data === void 0 ? void 0 : data.flatMap(continent => { var _a; return (_a = continent === null || continent === void 0 ? void 0 : continent.cn) === null || _a === void 0 ? void 0 : _a.map(country => ({ iso: country.i, name: country.n })); });
export const countries_by_continent = (iso) => {
    var _a;
    try {
        const continent = data === null || data === void 0 ? void 0 : data.find(c => c.i === iso);
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
// States
export const states = () => data.flatMap(continent => continent.cn).map(state => ({ iso: state.i, name: state.n }));
export const states_by_country = (iso) => {
    try {
        for (const continent of data) {
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
export const states_by_continent = (iso) => {
    try {
        const continent = data.find(c => c.i === iso);
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
// Cities
export const cities = () => data.flatMap(continent => continent.cn).flatMap(country => country.s || []).flatMap(state => state.c || []).map(city => ({ iso: city.i, name: city.n }));
export const cities_by_state = (iso) => {
    try {
        // Validate input format (e.g., 'GH-AA')
        if (!iso || typeof iso !== 'string' || iso.split('-').length !== 2) {
            return [];
        }
        const [countryIso, stateIso] = iso.split('-');
        // Safely traverse the data structure
        if (!data || !Array.isArray(data))
            return [];
        for (const continent of data) {
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
export const cities_by_country = (iso) => {
    var _a, _b, _c;
    try {
        return ((_c = (_b = (_a = data
            .flatMap(continent => continent.cn)
            .find(country => country.i === iso)) === null || _a === void 0 ? void 0 : _a.s) === null || _b === void 0 ? void 0 : _b.flatMap(state => state.c || [])) === null || _c === void 0 ? void 0 : _c.map(city => ({ iso: city.i, name: city.n }))) || [];
    }
    catch (e) {
        return [];
    }
};
export const cities_by_continent = (iso) => {
    try {
        const continent = data.find(c => c.i === iso);
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
