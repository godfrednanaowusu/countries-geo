const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🔄 Fixing Ghana coordinates to actual centers...');

// Accurate Ghana state coordinates
const ghanaStateCoords = {
  "Greater Accra": { lat: 5.60, lng: -0.20 },  // Accra region center
  "Ashanti": { lat: 6.72, lng: -1.62 },       // Kumasi region
  "Bono": { lat: 7.95, lng: -2.30 },          // Sunyani region
  "Bono East": { lat: 7.47, lng: -0.63 },     // Techiman region
  "Central": { lat: 5.50, lng: -1.25 },       // Cape Coast region
  "Eastern": { lat: 6.30, lng: -0.20 },       // Koforidua region
  "Northern": { lat: 9.50, lng: -1.00 },       // Tamale region
  "Savannah": { lat: 9.75, lng: -1.25 },      // Damongo region
  "Upper East": { lat: 10.75, lng: -0.50 },   // Bolgatanga region
  "Upper West": { lat: 10.25, lng: -2.50 },   // Wa region
  "Volta": { lat: 7.50, lng: 0.45 },          // Ho region
  "Western": { lat: 5.30, lng: -2.15 },       // Sekondi region
  "North East": { lat: 10.00, lng: -0.25 },   // Nalerigu region
  "Oti": { lat: 8.00, lng: 0.25 },            // Dambai region
  "Western North": { lat: 6.40, lng: -2.75 },  // Sefwi Wiawso region
  "Ahafo": { lat: 7.20, lng: -2.50 }          // Goaso region
};

// Accurate Ghana city coordinates
const ghanaCityCoords = {
  // Greater Accra cities
  "Accra Central": { lat: 5.60, lng: -0.20 },
  "Tema": { lat: 5.67, lng: -0.02 },
  "Achimota": { lat: 5.63, lng: -0.22 },
  "Adenta": { lat: 5.68, lng: -0.18 },
  "Ashaiman": { lat: 5.70, lng: -0.03 },
  "Dodowa": { lat: 5.88, lng: -0.17 },
  "Dawhenya": { lat: 5.72, lng: 0.00 },
  "Lashibi": { lat: 5.65, lng: -0.05 },
  "Madina": { lat: 5.66, lng: -0.17 },
  "Nungua": { lat: 5.60, lng: -0.10 },
  
  // Ashanti cities
  "Kumasi Central": { lat: 6.72, lng: -1.62 },
  "Obuasi": { lat: 6.20, lng: -1.65 },
  "Mampong": { lat: 7.42, lng: -1.40 },
  "Ejisu": { lat: 6.68, lng: -1.47 },
  "Bekwai": { lat: 6.45, lng: -1.58 },
  
  // Other major cities
  "Tamale Central": { lat: 9.40, lng: -0.84 },
  "Cape Coast Central": { lat: 5.10, lng: -1.28 },
  "Takoradi Central": { lat: 4.92, lng: -1.76 },
  "Ho Central": { lat: 6.60, lng: 0.47 },
  "Bolgatanga Central": { lat: 10.78, lng: -0.85 },
  "Wa Central": { lat: 10.26, lng: -2.48 },
  "Sunyani Central": { lat: 7.33, lng: -2.33 },
  "Koforidua Central": { lat: 6.08, lng: -0.26 }
};

let statesUpdated = 0;
let citiesUpdated = 0;

data.forEach(continent => {
  continent.cn.forEach(country => {
    if (country.i === 'GH') {
      console.log('Found Ghana');
      
      // Update state coordinates
      if (country.s) {
        country.s.forEach(state => {
          const stateName = state.n;
          if (ghanaStateCoords[stateName]) {
            state.mtd = { coor: ghanaStateCoords[stateName] };
            statesUpdated++;
            console.log(`  Updated state: ${stateName}`);
          }
          
          // Update city coordinates
          if (state.c) {
            state.c.forEach(city => {
              const cityName = city.n;
              if (ghanaCityCoords[cityName]) {
                city.mtd = { coor: ghanaCityCoords[cityName] };
                citiesUpdated++;
                console.log(`    Updated city: ${cityName}`);
              }
            });
          }
        });
      }
    }
  });
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log(`\n✅ Updated Ghana coordinates:`);
console.log(`  States: ${statesUpdated}`);
console.log(`  Cities: ${citiesUpdated}`);
