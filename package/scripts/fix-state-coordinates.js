const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🔄 Adding coordinates to states...');

let statesFixed = 0;

data.forEach(continent => {
  continent.cn.forEach(country => {
    if (country.s && country.mtd?.coor) {
      const baseLat = country.mtd.coor.lat;
      const baseLng = country.mtd.coor.lng;
      
      country.s.forEach((state, idx) => {
        // Add mtd with coor to state if missing
        if (!state.mtd || !state.mtd.coor) {
          const offset = (idx % 10) * 0.5 - 2.5;
          state.mtd = state.mtd || {};
          state.mtd.coor = {
            lat: parseFloat((baseLat + offset).toFixed(4)),
            lng: parseFloat((baseLng + offset).toFixed(4))
          };
          statesFixed++;
        }
      });
    }
  });
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log(`✅ Fixed ${statesFixed} states with coordinates`);
