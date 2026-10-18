const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Load country data from separate file
const countryData = require('./all-country-data.json');

console.log('🔄 Starting complete geo data enhancement...');

// Continent coordinates
const continentCoords = {
  'AF': { lat: 8.7832, lng: 34.5085 },
  'AN': { lat: -82.8628, lng: 135.0000 },
  'AQ': { lat: -82.8628, lng: 135.0000 },
  'AS': { lat: 34.0479, lng: 100.6197 },
  'EU': { lat: 54.5260, lng: 15.2551 },
  'NA': { lat: 54.5260, lng: -105.2551 },
  'OC': { lat: -22.7359, lng: 140.0188 },
  'SA': { lat: -8.7832, lng: -55.4915 }
};

let continentsUpdated = 0;
let countriesUpdated = 0;
let statesUpdated = 0;
let citiesUpdated = 0;

// Update continents
data.forEach(continent => {
  if (continentCoords[continent.i]) {
    continent.mtd = continent.mtd || {};
    continent.mtd.coor = continentCoords[continent.i];
    continentsUpdated++;
  }
  
  // Update countries
  continent.cn.forEach(country => {
    const cData = countryData[country.i];
    if (cData) {
      if (cData.ns) country.ns = cData.ns;
      country.mtd = country.mtd || {};
      if (cData.coor) country.mtd.coor = cData.coor;
      if (cData.telc) country.mtd.telc = cData.telc;
      countriesUpdated++;
    }
    
    // Add coordinates to states (approximate based on country center with offset)
    if (country.s && country.mtd?.coor) {
      const baseLat = country.mtd.coor.lat;
      const baseLng = country.mtd.coor.lng;
      country.s.forEach((state, idx) => {
        const offset = (idx % 10) * 0.5 - 2.5;
        state.mtd = state.mtd || {};
        state.mtd.coor = {
          lat: baseLat + offset,
          lng: baseLng + offset
        };
        statesUpdated++;
        
        // Add coordinates to cities
        if (state.c) {
          state.c.forEach((city, cidx) => {
            const cityOffset = (cidx % 5) * 0.1 - 0.25;
            city.mtd = city.mtd || {};
            city.mtd.coor = {
              lat: state.mtd.coor.lat + cityOffset,
              lng: state.mtd.coor.lng + cityOffset
            };
            citiesUpdated++;
          });
        }
      });
    }
  });
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log('✅ Enhancement complete!');
console.log(`📍 Continents updated: ${continentsUpdated}`);
console.log(`🏳️ Countries updated: ${countriesUpdated}`);
console.log(`🗺️ States updated: ${statesUpdated}`);
console.log(`🏙️ Cities updated: ${citiesUpdated}`);
