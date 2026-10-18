const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Country translations and coordinates database
const countryData = require('./country-data.json');

console.log('🔄 Adding translations and coordinates...');

let countriesUpdated = 0;

data.forEach(continent => {
  continent.cn.forEach(country => {
    const countryInfo = countryData[country.i];
    if (countryInfo) {
      // Update translations
      if (countryInfo.ns) {
        country.ns = countryInfo.ns;
      }
      // Update metadata with coordinates
      if (countryInfo.coor || countryInfo.telc) {
        country.mtd = country.mtd || {};
        if (countryInfo.coor) country.mtd.coor = countryInfo.coor;
        if (countryInfo.telc) country.mtd.telc = countryInfo.telc;
      }
      countriesUpdated++;
    }
  });
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(`✅ Updated ${countriesUpdated} countries with translations and coordinates`);
