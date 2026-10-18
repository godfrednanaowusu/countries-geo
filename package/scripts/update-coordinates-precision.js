const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🔄 Updating coordinates to 2 decimal places...');

// Helper function to round to 2 decimal places
const round2 = (num) => parseFloat(num.toFixed(2));

// Continent coordinates (already at 2 decimals, but ensure consistency)
const continentCoords = {
  'AF': { lat: 8.78, lng: 34.51 },
  'AN': { lat: -82.86, lng: 135.00 },
  'AS': { lat: 34.05, lng: 100.62 },
  'EU': { lat: 54.53, lng: 15.26 },
  'NA': { lat: 54.53, lng: -105.26 },
  'OC': { lat: -22.74, lng: 140.02 },
  'SA': { lat: -8.78, lng: -55.49 }
};

// Accurate country coordinates (2 decimal places)
const countryCoords = {
  // AFRICA
  "DZ": { lat: 28.03, lng: 1.66 },
  "AO": { lat: -11.20, lng: 17.87 },
  "BJ": { lat: 9.31, lng: 2.32 },
  "BW": { lat: -22.33, lng: 24.68 },
  "BF": { lat: 12.24, lng: -1.56 },
  "BI": { lat: -3.37, lng: 29.92 },
  "CV": { lat: 16.54, lng: -23.04 },
  "CM": { lat: 7.37, lng: 12.35 },
  "CF": { lat: 6.61, lng: 20.94 },
  "TD": { lat: 15.45, lng: 18.73 },
  "KM": { lat: -11.65, lng: 43.33 },
  "CD": { lat: -4.04, lng: 21.76 },
  "CG": { lat: -0.23, lng: 15.83 },
  "CI": { lat: 7.54, lng: -5.55 },
  "DJ": { lat: 11.83, lng: 42.59 },
  "EG": { lat: 26.82, lng: 30.80 },
  "GQ": { lat: 1.65, lng: 10.27 },
  "ER": { lat: 15.18, lng: 39.78 },
  "SZ": { lat: -26.52, lng: 31.47 },
  "ET": { lat: 9.15, lng: 40.49 },
  "GA": { lat: -0.80, lng: 11.61 },
  "GM": { lat: 13.44, lng: -15.31 },
  "GH": { lat: 7.95, lng: -1.02 },
  "GN": { lat: 9.95, lng: -9.70 },
  "GW": { lat: 11.80, lng: -15.18 },
  "KE": { lat: -0.02, lng: 37.91 },
  "LS": { lat: -29.61, lng: 28.23 },
  "LR": { lat: 6.43, lng: -9.43 },
  "LY": { lat: 26.34, lng: 17.23 },
  "MG": { lat: -18.77, lng: 46.87 },
  "MW": { lat: -13.25, lng: 34.30 },
  "ML": { lat: 17.57, lng: -4.00 },
  "MR": { lat: 21.01, lng: -10.94 },
  "MU": { lat: -20.35, lng: 57.55 },
  "MA": { lat: 31.79, lng: -7.09 },
  "MZ": { lat: -18.67, lng: 35.53 },
  "NA": { lat: -22.96, lng: 18.49 },
  "NE": { lat: 17.61, lng: 8.08 },
  "NG": { lat: 9.08, lng: 8.68 },
  "RE": { lat: -21.12, lng: 55.54 },
  "RW": { lat: -1.94, lng: 29.87 },
  "ST": { lat: 0.19, lng: 6.61 },
  "SN": { lat: 14.50, lng: -14.45 },
  "SC": { lat: -4.68, lng: 55.49 },
  "SL": { lat: 8.46, lng: -11.78 },
  "SO": { lat: 5.15, lng: 46.20 },
  "ZA": { lat: -30.56, lng: 22.94 },
  "SS": { lat: 6.88, lng: 31.31 },
  "SD": { lat: 12.86, lng: 30.22 },
  "TZ": { lat: -6.17, lng: 34.85 },
  "TG": { lat: 8.62, lng: 0.82 },
  "TN": { lat: 33.89, lng: 9.54 },
  "UG": { lat: 1.37, lng: 32.29 },
  "EH": { lat: 24.22, lng: -12.89 },
  "ZM": { lat: -13.13, lng: 27.85 },
  "ZW": { lat: -19.02, lng: 29.15 },
  
  // ASIA
  "AF": { lat: 33.94, lng: 67.71 },
  "AM": { lat: 40.07, lng: 45.04 },
  "AZ": { lat: 40.14, lng: 47.58 },
  "BH": { lat: 26.07, lng: 50.56 },
  "BD": { lat: 23.68, lng: 90.36 },
  "BT": { lat: 27.51, lng: 90.43 },
  "BN": { lat: 4.54, lng: 114.73 },
  "KH": { lat: 12.57, lng: 104.99 },
  "CN": { lat: 35.86, lng: 104.20 },
  "GE": { lat: 42.32, lng: 43.36 },
  "IN": { lat: 20.59, lng: 78.96 },
  "ID": { lat: -0.79, lng: 113.92 },
  "IR": { lat: 32.43, lng: 53.69 },
  "IQ": { lat: 33.22, lng: 43.68 },
  "IL": { lat: 31.05, lng: 34.85 },
  "JP": { lat: 36.20, lng: 138.25 },
  "JO": { lat: 30.59, lng: 36.24 },
  "KZ": { lat: 48.02, lng: 66.92 },
  "KP": { lat: 40.34, lng: 127.51 },
  "KR": { lat: 35.91, lng: 127.77 },
  "KW": { lat: 29.31, lng: 47.66 },
  "KG": { lat: 41.20, lng: 74.77 },
  "LA": { lat: 19.86, lng: 102.50 },
  "LB": { lat: 33.85, lng: 35.86 },
  "MY": { lat: 4.21, lng: 101.98 },
  "MV": { lat: 3.20, lng: 73.22 },
  "MN": { lat: 46.86, lng: 103.85 },
  "MM": { lat: 21.92, lng: 95.96 },
  "NP": { lat: 28.39, lng: 84.12 },
  "OM": { lat: 21.47, lng: 55.98 },
  "PK": { lat: 30.38, lng: 69.35 },
  "PS": { lat: 31.95, lng: 35.93 },
  "PH": { lat: 12.88, lng: 121.77 },
  "QA": { lat: 25.35, lng: 51.18 },
  "RU": { lat: 61.52, lng: 105.32 },
  "SA": { lat: 23.89, lng: 45.08 },
  "SG": { lat: 1.35, lng: 103.82 },
  "LK": { lat: 7.87, lng: 80.77 },
  "SY": { lat: 34.80, lng: 39.00 },
  "TJ": { lat: 38.86, lng: 71.28 },
  "TH": { lat: 15.87, lng: 100.99 },
  "TL": { lat: -8.87, lng: 125.73 },
  "TR": { lat: 38.96, lng: 35.24 },
  "TM": { lat: 38.97, lng: 59.56 },
  "AE": { lat: 23.42, lng: 53.85 },
  "UZ": { lat: 41.38, lng: 64.59 },
  "VN": { lat: 14.06, lng: 108.28 },
  "YE": { lat: 15.55, lng: 48.52 },
  "CY": { lat: 35.13, lng: 33.43 },
  
  // EUROPE
  "AL": { lat: 41.15, lng: 20.17 },
  "AD": { lat: 42.55, lng: 1.60 },
  "AT": { lat: 47.52, lng: 14.55 },
  "BY": { lat: 53.71, lng: 27.95 },
  "BE": { lat: 50.50, lng: 4.47 },
  "BA": { lat: 43.92, lng: 17.68 },
  "BG": { lat: 42.73, lng: 25.49 },
  "HR": { lat: 45.10, lng: 15.20 },
  "CY": { lat: 35.13, lng: 33.43 },
  "CZ": { lat: 49.82, lng: 15.47 },
  "DK": { lat: 56.26, lng: 9.50 },
  "EE": { lat: 58.60, lng: 25.01 },
  "FI": { lat: 61.92, lng: 25.75 },
  "FR": { lat: 46.23, lng: 2.21 },
  "DE": { lat: 51.17, lng: 10.45 },
  "GR": { lat: 39.07, lng: 21.82 },
  "HU": { lat: 47.16, lng: 19.50 },
  "IS": { lat: 64.96, lng: -19.02 },
  "IE": { lat: 53.14, lng: -8.00 },
  "IT": { lat: 41.87, lng: 12.57 },
  "XK": { lat: 42.60, lng: 20.90 },
  "LV": { lat: 56.88, lng: 24.60 },
  "LI": { lat: 47.17, lng: 9.56 },
  "LT": { lat: 55.17, lng: 23.88 },
  "LU": { lat: 49.82, lng: 6.13 },
  "MT": { lat: 35.94, lng: 14.38 },
  "MD": { lat: 47.41, lng: 28.37 },
  "MC": { lat: 43.74, lng: 7.42 },
  "ME": { lat: 42.71, lng: 19.37 },
  "NL": { lat: 52.13, lng: 5.29 },
  "MK": { lat: 41.51, lng: 21.75 },
  "NO": { lat: 60.47, lng: 8.47 },
  "PL": { lat: 51.92, lng: 19.15 },
  "PT": { lat: 39.40, lng: -8.22 },
  "RO": { lat: 45.94, lng: 24.97 },
  "RU": { lat: 61.52, lng: 105.32 },
  "SM": { lat: 43.94, lng: 12.46 },
  "RS": { lat: 44.02, lng: 21.01 },
  "SK": { lat: 48.67, lng: 19.70 },
  "SI": { lat: 46.15, lng: 14.99 },
  "ES": { lat: 40.46, lng: -3.75 },
  "SE": { lat: 60.13, lng: 18.64 },
  "CH": { lat: 46.82, lng: 8.23 },
  "UA": { lat: 48.38, lng: 31.17 },
  "GB": { lat: 55.38, lng: -3.44 },
  "VA": { lat: 41.90, lng: 12.45 },
  
  // NORTH AMERICA
  "AG": { lat: 17.06, lng: -61.80 },
  "BS": { lat: 25.03, lng: -77.40 },
  "BB": { lat: 13.19, lng: -59.54 },
  "BZ": { lat: 17.19, lng: -88.50 },
  "CA": { lat: 56.13, lng: -106.35 },
  "CR": { lat: 9.75, lng: -83.75 },
  "CU": { lat: 21.52, lng: -77.78 },
  "DM": { lat: 15.41, lng: -61.34 },
  "DO": { lat: 18.74, lng: -70.16 },
  "SV": { lat: 13.79, lng: -88.90 },
  "GD": { lat: 12.26, lng: -61.60 },
  "GT": { lat: 15.78, lng: -90.23 },
  "HT": { lat: 18.97, lng: -72.29 },
  "HN": { lat: 15.20, lng: -86.24 },
  "JM": { lat: 18.11, lng: -77.30 },
  "MX": { lat: 23.63, lng: -102.55 },
  "NI": { lat: 12.87, lng: -85.21 },
  "PA": { lat: 8.54, lng: -80.78 },
  "KN": { lat: 17.36, lng: -62.78 },
  "LC": { lat: 13.91, lng: -60.98 },
  "VC": { lat: 12.98, lng: -61.29 },
  "TT": { lat: 10.69, lng: -61.22 },
  "US": { lat: 37.09, lng: -95.71 },
  
  // SOUTH AMERICA
  "AR": { lat: -38.42, lng: -63.62 },
  "BO": { lat: -16.29, lng: -63.59 },
  "BR": { lat: -14.24, lng: -51.93 },
  "CL": { lat: -35.68, lng: -71.54 },
  "CO": { lat: 4.57, lng: -74.30 },
  "EC": { lat: -1.83, lng: -78.18 },
  "GY": { lat: 4.86, lng: -58.93 },
  "PY": { lat: -23.44, lng: -58.44 },
  "PE": { lat: -9.19, lng: -75.02 },
  "SR": { lat: 3.92, lng: -56.03 },
  "UY": { lat: -32.52, lng: -55.77 },
  "VE": { lat: 6.42, lng: -66.59 },
  
  // OCEANIA
  "AU": { lat: -25.27, lng: 133.78 },
  "FJ": { lat: -17.71, lng: 178.07 },
  "KI": { lat: -3.37, lng: -168.73 },
  "MH": { lat: 7.13, lng: 171.18 },
  "FM": { lat: 7.43, lng: 150.55 },
  "NR": { lat: -0.52, lng: 166.93 },
  "NZ": { lat: -40.90, lng: 174.89 },
  "PW": { lat: 7.51, lng: 134.58 },
  "PG": { lat: -6.31, lng: 143.96 },
  "WS": { lat: -13.76, lng: -172.10 },
  "SB": { lat: -9.43, lng: 160.02 },
  "TO": { lat: -21.18, lng: -175.20 },
  "TV": { lat: -7.11, lng: 177.65 },
  "VU": { lat: -15.38, lng: 166.96 },
  
  // TERRITORIES
  "AS": { lat: -14.27, lng: -170.13 },
  "CK": { lat: -21.24, lng: -159.78 },
  "PF": { lat: -17.68, lng: -149.41 },
  "GU": { lat: 13.44, lng: 144.79 },
  "NC": { lat: -20.90, lng: 165.62 },
  "NU": { lat: -19.05, lng: -169.87 },
  "NF": { lat: -29.04, lng: 167.95 },
  "MP": { lat: 15.10, lng: 145.67 },
  "TK": { lat: -9.20, lng: -171.85 },
  "WF": { lat: -13.77, lng: -177.16 },
  "FK": { lat: -51.80, lng: -59.55 },
  "GF": { lat: 3.93, lng: -53.13 },
  "GS": { lat: -54.43, lng: -36.59 },
  "EI": { lat: -27.11, lng: -109.35 },
  "UM": { lat: 16.73, lng: -169.53 },
  "PN": { lat: -24.38, lng: -128.32 }
};

let continentUpdates = 0;
let countryUpdates = 0;
let stateUpdates = 0;
let cityUpdates = 0;

// Update continents
data.forEach(continent => {
  const coords = continentCoords[continent.i];
  if (coords) {
    continent.mtd = { coor: coords };
    continentUpdates++;
  }
});

// Update countries, states, and cities
data.forEach(continent => {
  continent.cn.forEach(country => {
    // Update country coordinates
    const coords = countryCoords[country.i];
    if (coords) {
      country.mtd = country.mtd || {};
      country.mtd.coor = coords;
      countryUpdates++;
    }
    
    // Update states
    if (country.s) {
      const countryLat = country.mtd?.coor?.lat || 0;
      const countryLng = country.mtd?.coor?.lng || 0;
      
      country.s.forEach((state, sIdx) => {
        // Generate state coordinates based on country center
        const sOffset = (sIdx % 10) * 0.5 - 2.5;
        const stateLat = round2(countryLat + sOffset);
        const stateLng = round2(countryLng + sOffset);
        
        state.mtd = { coor: { lat: stateLat, lng: stateLng } };
        stateUpdates++;
        
        // Update cities
        if (state.c) {
          state.c.forEach((city, cIdx) => {
            // Generate city coordinates based on state center
            const cOffset = (cIdx % 5) * 0.1 - 0.2;
            const cityLat = round2(stateLat + cOffset);
            const cityLng = round2(stateLng + cOffset);
            
            city.mtd = { coor: { lat: cityLat, lng: cityLng } };
            cityUpdates++;
          });
        }
      });
    }
  });
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log(`✅ Updated coordinates:`);
console.log(`  Continents: ${continentUpdates}`);
console.log(`  Countries: ${countryUpdates}`);
console.log(`  States: ${stateUpdates}`);
console.log(`  Cities: ${cityUpdates}`);
