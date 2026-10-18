const assert = require('node:assert/strict');
const { test } = require('node:test');
const { Cities, Countries, States } = require('../dist/cjs/index.js');

test('CommonJS build', async () => {
  assert.equal(Countries.get('GH').name, 'Ghana');
  assert.equal(States.getByCountry('GH').length, 16);
  const cities = await Cities.getByCountry('GH');
  assert.ok(cities.some((c) => c.name === 'Kumasi'));
});
