const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🔍 Comprehensive Data Integrity Verification');
console.log('='.repeat(60));

// Helper functions
const round2 = (num) => parseFloat(num.toFixed(2));
const hasValidCoords = (obj) => {
  if (!obj?.mtd?.coor) return false;
  const { lat, lng } = obj.mtd.coor;
  return typeof lat === 'number' && typeof lng === 'number' &&
         lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};
const hasValidPrecision = (obj) => {
  if (!obj?.mtd?.coor) return false;
  const latPrec = obj.mtd.coor.lat.toString().split('.')[1]?.length || 0;
  const lngPrec = obj.mtd.coor.lng.toString().split('.')[1]?.length || 0;
  return latPrec <= 2 && lngPrec <= 2;
};

// Check continents
console.log('\n📊 CONTINENTS:');
const continentResults = {
  total: data.length,
  withCoords: 0,
  withValidPrecision: 0,
  withTranslations: 0
};

data.forEach(continent => {
  if (hasValidCoords(continent)) continentResults.withCoords++;
  if (hasValidPrecision(continent)) continentResults.withValidPrecision++;
  if (continent.ns?.zh) continentResults.withTranslations++;
});

console.log(`  Total: ${continentResults.total}`);
console.log(`  With coordinates: ${continentResults.withCoords} (${((continentResults.withCoords/continentResults.total)*100).toFixed(1)}%)`);
console.log(`  With 2-decimal precision: ${continentResults.withValidPrecision} (${((continentResults.withValidPrecision/continentResults.total)*100).toFixed(1)}%)`);
console.log(`  With translations: ${continentResults.withTranslations} (${((continentResults.withTranslations/continentResults.total)*100).toFixed(1)}%)`);

// Check countries
console.log('\n📊 COUNTRIES:');
const countries = data.flatMap(c => c.cn);
const countryResults = {
  total: countries.length,
  withCoords: 0,
  withValidPrecision: 0,
  withTranslations: 0,
  withTelCodes: 0,
  duplicateIso2: [],
  duplicateIso3: []
};

const iso2Set = new Set();
const iso3Set = new Set();

countries.forEach(country => {
  if (hasValidCoords(country)) countryResults.withCoords++;
  if (hasValidPrecision(country)) countryResults.withValidPrecision++;
  if (country.ns?.zh) countryResults.withTranslations++;
  if (country.mtd?.telc) countryResults.withTelCodes++;
  
  // Check for duplicates
  const iso2 = country.iso?.['2'];
  const iso3 = country.iso?.['3'];
  if (iso2) {
    if (iso2Set.has(iso2)) countryResults.duplicateIso2.push(iso2);
    iso2Set.add(iso2);
  }
  if (iso3) {
    if (iso3Set.has(iso3)) countryResults.duplicateIso3.push(iso3);
    iso3Set.add(iso3);
  }
});

console.log(`  Total: ${countryResults.total}`);
console.log(`  With coordinates: ${countryResults.withCoords} (${((countryResults.withCoords/countryResults.total)*100).toFixed(1)}%)`);
console.log(`  With 2-decimal precision: ${countryResults.withValidPrecision} (${((countryResults.withValidPrecision/countryResults.total)*100).toFixed(1)}%)`);
console.log(`  With translations: ${countryResults.withTranslations} (${((countryResults.withTranslations/countryResults.total)*100).toFixed(1)}%)`);
console.log(`  With tel codes: ${countryResults.withTelCodes} (${((countryResults.withTelCodes/countryResults.total)*100).toFixed(1)}%)`);
console.log(`  Duplicate ISO2 codes: ${countryResults.duplicateIso2.length > 0 ? countryResults.duplicateIso2 : 'None'}`);
console.log(`  Duplicate ISO3 codes: ${countryResults.duplicateIso3.length > 0 ? countryResults.duplicateIso3 : 'None'}`);

// Check states
console.log('\n📊 STATES:');
const states = countries.flatMap(c => c.s || []);
const stateResults = {
  total: states.length,
  withCoords: 0,
  withValidPrecision: 0,
  withTranslations: 0
};

states.forEach(state => {
  if (hasValidCoords(state)) stateResults.withCoords++;
  if (hasValidPrecision(state)) stateResults.withValidPrecision++;
  if (state.ns?.zh) stateResults.withTranslations++;
});

console.log(`  Total: ${stateResults.total}`);
console.log(`  With coordinates: ${stateResults.withCoords} (${((stateResults.withCoords/stateResults.total)*100).toFixed(1)}%)`);
console.log(`  With 2-decimal precision: ${stateResults.withValidPrecision} (${((stateResults.withValidPrecision/stateResults.total)*100).toFixed(1)}%)`);
console.log(`  With translations: ${stateResults.withTranslations} (${((stateResults.withTranslations/stateResults.total)*100).toFixed(1)}%)`);

// Check cities
console.log('\n📊 CITIES:');
const cities = states.flatMap(s => s.c || []);
const cityResults = {
  total: cities.length,
  withCoords: 0,
  withValidPrecision: 0,
  withTranslations: 0
};

cities.forEach(city => {
  if (hasValidCoords(city)) cityResults.withCoords++;
  if (hasValidPrecision(city)) cityResults.withValidPrecision++;
  if (city.ns?.zh) cityResults.withTranslations++;
});

console.log(`  Total: ${cityResults.total}`);
console.log(`  With coordinates: ${cityResults.withCoords} (${((cityResults.withCoords/cityResults.total)*100).toFixed(1)}%)`);
console.log(`  With 2-decimal precision: ${cityResults.withValidPrecision} (${((cityResults.withValidPrecision/cityResults.total)*100).toFixed(1)}%)`);
console.log(`  With translations: ${cityResults.withTranslations} (${((cityResults.withTranslations/cityResults.total)*100).toFixed(1)}%)`);

// Sample verification
console.log('\n🔍 SAMPLE VERIFICATION:');
console.log('\n  Ghana:');
const ghana = countries.find(c => c.i === 'GH');
if (ghana) {
  console.log(`    Country: ${JSON.stringify(ghana.mtd?.coor)}`);
  const greaterAccra = ghana.s?.find(s => s.n === 'Greater Accra');
  if (greaterAccra) {
    console.log(`    Greater Accra: ${JSON.stringify(greaterAccra.mtd?.coor)}`);
    const achimota = greaterAccra.c?.find(c => c.n === 'Achimota');
    if (achimota) {
      console.log(`    Achimota: ${JSON.stringify(achimota.mtd?.coor)}`);
    }
  }
}

console.log('\n  Antarctica:');
const antarctica = data.find(c => c.i === 'AQ');
if (antarctica) {
  console.log(`    Continent: ${JSON.stringify(antarctica.mtd?.coor)}`);
  const first = antarctica.cn[0];
  if (first) {
    console.log(`    ${first.n}: ISO2=${first.i}, ISO3=${first.iso?.['3']}`);
  }
}

// Overall summary
console.log('\n📋 OVERALL SUMMARY:');
const allEntities = continentResults.total + countryResults.total + stateResults.total + cityResults.total;
const allWithCoords = continentResults.withCoords + countryResults.withCoords + stateResults.withCoords + cityResults.withCoords;
const allWithPrecision = continentResults.withValidPrecision + countryResults.withValidPrecision + stateResults.withValidPrecision + cityResults.withValidPrecision;

console.log(`  Total entities: ${allEntities}`);
console.log(`  With coordinates: ${allWithCoords} (${((allWithCoords/allEntities)*100).toFixed(1)}%)`);
console.log(`  With 2-decimal precision: ${allWithPrecision} (${((allWithPrecision/allEntities)*100).toFixed(1)}%)`);
console.log(`  Duplicate ISO codes: ${countryResults.duplicateIso2.length + countryResults.duplicateIso3.length}`);

if (countryResults.duplicateIso2.length === 0 && 
    countryResults.duplicateIso3.length === 0 &&
    allWithCoords === allEntities &&
    allWithPrecision === allEntities) {
  console.log('\n✅ DATA INTEGRITY: PASSED');
} else {
  console.log('\n❌ DATA INTEGRITY: ISSUES FOUND');
}
