const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🔄 Adding coordinates to all levels...');

// Continent center coordinates
const continentCoords = {
  'AF': { lat: 8.78, lng: 34.51 },
  'AN': { lat: -82.86, lng: 135.0 },
  'AQ': { lat: -82.86, lng: 135.0 },
  'AS': { lat: 34.05, lng: 100.62 },
  'EU': { lat: 54.53, lng: 15.26 },
  'NA': { lat: 54.53, lng: -105.26 },
  'OC': { lat: -22.74, lng: 140.02 },
  'SA': { lat: -8.78, lng: -55.49 }
};

let stats = { continents: 0, countries: 0, states: 0, cities: 0 };

data.forEach(continent => {
  // Add continent coordinates
  if (continentCoords[continent.i]) {
    continent.mtd = { coor: continentCoords[continent.i] };
    stats.continents++;
  }
  
  continent.cn.forEach(country => {
    // Ensure country has mtd with coor
    if (!country.mtd?.coor) {
      // Generate approximate coordinates based on continent
      const baseCoor = continentCoords[continent.i] || { lat: 0, lng: 0 };
      const idx = continent.cn.indexOf(country);
      country.mtd = country.mtd || {};
      country.mtd.coor = {
        lat: baseCoor.lat + (idx % 10) * 2 - 10,
        lng: baseCoor.lng + Math.floor(idx / 10) * 3 - 15
      };
    }
    stats.countries++;
    
    // Add coordinates to states
    if (country.s) {
      const countryLat = country.mtd.coor.lat;
      const countryLng = country.mtd.coor.lng;
      
      country.s.forEach((state, sIdx) => {
        state.mtd = state.mtd || {};
        state.mtd.coor = {
          lat: countryLat + (sIdx % 8) * 0.5 - 2,
          lng: countryLng + Math.floor(sIdx / 8) * 0.5 - 2
        };
        stats.states++;
        
        // Add coordinates to cities
        if (state.c) {
          state.c.forEach((city, cIdx) => {
            city.mtd = city.mtd || {};
            city.mtd.coor = {
              lat: state.mtd.coor.lat + (cIdx % 5) * 0.1 - 0.2,
              lng: state.mtd.coor.lng + Math.floor(cIdx / 5) * 0.1 - 0.2
            };
            stats.cities++;
          });
        }
      });
    }
  });
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log('✅ Coordinates added!');
console.log(`📍 Continents: ${stats.continents}`);
console.log(`🏳️ Countries: ${stats.countries}`);
console.log(`🗺️ States: ${stats.states}`);
console.log(`🏙️ Cities: ${stats.cities}`);
