const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🔄 Fixing Antarctic ISO3 codes...');

const antarctica = data.find(c => c.i === 'AQ');
let fixed = 0;

if (antarctica) {
  antarctica.cn.forEach(country => {
    if (country.iso?.['3'] === 'AQ-') {
      // Set ISO3 to match ISO2 for uniqueness
      country.iso['3'] = country.i;
      fixed++;
    }
  });
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log(`✅ Fixed ${fixed} Antarctic ISO3 codes`);

// Verify
const updatedData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const antarcticCountries = updatedData.find(c => c.i === 'AQ')?.cn || [];
console.log('\n🔍 Updated Antarctic territories:');
antarcticCountries.forEach(c => {
  console.log(`  ${c.n}: ISO2=${c.i}, ISO3=${c.iso?.['3']}`);
});
