const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🔄 Fixing duplicate ISO3 codes...');

// Fix Antarctic territories ISO3 codes
const iso3Fixes = {
  'AQ-': 'AQ-ARG',  // Argentine Antarctica
  'AQ-': 'AQ-AUS',  // Australian Antarctic Territory
  'AQ-': 'AQ-CHL',  // Chilean Antarctic Territory
  'AQ-': 'AQ-FRA',  // Adélie Land (France)
  'AQ-': 'AQ-NZL',  // Ross Dependency (New Zealand)
  'AQ-': 'AQ-NOR',  // Queen Maud Land (Norway)
  'AQ-': 'AQ-GBR',  // British Antarctic Territory
  'AQ-': 'AQ-UNC'   // Unclaimed Territory
};

let fixed = 0;

data.forEach(continent => {
  if (continent.i === 'AN') {
    continent.cn.forEach(country => {
      if (country.iso?.['3'] === 'AQ-') {
        // Use the country name to determine the correct ISO3
        const name = country.n;
        if (name.includes('Argentine')) {
          country.iso['3'] = 'AQ-ARG';
        } else if (name.includes('Australian')) {
          country.iso['3'] = 'AQ-AUS';
        } else if (name.includes('Chilean')) {
          country.iso['3'] = 'AQ-CHL';
        } else if (name.includes('Adélie') || name.includes('France')) {
          country.iso['3'] = 'AQ-FRA';
        } else if (name.includes('Ross') || name.includes('New Zealand')) {
          country.iso['3'] = 'AQ-NZL';
        } else if (name.includes('Queen') || name.includes('Norway')) {
          country.iso['3'] = 'AQ-NOR';
        } else if (name.includes('British')) {
          country.iso['3'] = 'AQ-GBR';
        } else if (name.includes('Unclaimed') || name.includes('Marie')) {
          country.iso['3'] = 'AQ-UNC';
        }
        fixed++;
      }
    });
  }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log(`✅ Fixed ${fixed} duplicate ISO3 codes`);

// Verify
const updatedData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const antarcticCountries = updatedData.find(c => c.i === 'AN')?.cn || [];
console.log('\n🔍 Antarctic territories:');
antarcticCountries.forEach(c => {
  console.log(`  ${c.n}: ${c.iso?.['3']}`);
});
