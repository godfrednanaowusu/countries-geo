declare const _default: {
    getAll: import("./types").TState[];
    sortByIsoCode: import("./types").TState[];
    getByCountry: (iso: string) => {
        iso: string;
        name: string;
    }[];
    getByContinent: (iso: string) => {
        iso: string;
        name: string;
    }[];
};
export default _default;
