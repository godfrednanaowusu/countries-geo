export type TContinentData = {
    i: string;    // Represents ISO code
    n: string;    // Represents name
    cn: any[];    // Represents countries (unused)
  };
  
export type TContinent = {
    iso: string;
    name: string;
};

export type TCountry = {
    iso: string;
    name: string;
};

export type TState = {
    iso: string;
    name: string;
};

export type TCity = {
    iso: string;
    name: string;
};
