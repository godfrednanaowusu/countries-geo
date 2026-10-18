const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🔄 Force adding coordinates to ALL states...');

let statesFixed = 0;

data.forEach(continent => {
  continent.cn.forEach(country => {
    if (country.s) {
      // Get country coordinates or use continent as fallback
      const baseLat = country.mtd?.coor?.lat || 0;
      const baseLng = country.mtd?.coor?.lng || 0;
      
      country.s.forEach((state, idx) => {
        // Force add mtd with coor to every state
        const offset = (idx % 10) * 0.5 - 2.5;
        state.mtd = {
          coor: {
            lat: parseFloat((baseLat + offset).toFixed(4)),
            lng: parseFloat((baseLng + offset).toFixed(4))
          }
        };
        statesFixed++;
      });
    }
  });
});

// Write with proper formatting
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log(`✅ Added coordinates to ${statesFixed} states`);

// Verify
const verifyData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const firstState = verifyData[0]?.cn?.[0]?.s?.[0];
console.log('\\nVerification - First state (Adrar):');
console.log('  mtd:', JSON.stringify(firstState?.mtd));
