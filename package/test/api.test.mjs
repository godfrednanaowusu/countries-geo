import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Cities, Continents, Countries, States, Timezones, loadLanguage, supportedLanguages } from '../dist/esm/index.js';

const km = (a, b) => {
  const r = Math.PI / 180;
  const h = Math.sin(((b.lat - a.lat) * r) / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lng - a.lng) * r) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

test('continents', () => {
  const all = Continents.getAll;
  assert.equal(all.length, 7);
  assert.deepEqual(all.map((c) => c.iso), ['AF', 'AQ', 'AS', 'EU', 'NA', 'OC', 'SA']);
  const africa = Continents.get('AFR');
  assert.equal(africa.name, 'Africa');
  // Geographic centre of Africa lies in the Central African Republic / Congo basin area.
  assert.ok(africa.coordinates.lat > -2 && africa.coordinates.lat < 8, JSON.stringify(africa.coordinates));
  assert.ok(africa.coordinates.lng > 14 && africa.coordinates.lng < 24, JSON.stringify(africa.coordinates));
  assert.ok(africa.timezones.includes('Africa/Accra'));
  assert.deepEqual(Continents.sortByIsoCode.map((c) => c.iso), ['AF', 'AQ', 'AS', 'EU', 'NA', 'OC', 'SA']);
});

test('countries', () => {
  assert.equal(Countries.getAll.length, 246);
  const gh = Countries.get('GH');
  assert.equal(gh.iso3, 'GHA');
  assert.equal(gh.numeric, '288');
  assert.equal(gh.continent, 'AF');
  assert.equal(gh.phoneCode, '+233');
  assert.deepEqual(gh.timezones, ['Africa/Accra']);
  // Centre of Ghana is around Kintampo / Yeji (~7.95 N, 1.03 W).
  assert.ok(km(gh.coordinates, { lat: 7.95, lng: -1.03 }) < 40, JSON.stringify(gh.coordinates));
  assert.deepEqual(Countries.get('gha'), gh);
  assert.equal(Countries.get('TW'), undefined, 'Taiwan is a province of China in this dataset');
  assert.equal(Countries.get('AS').iso3, 'ASM');
  assert.ok(Countries.getByContinent('AF').some((c) => c.iso === 'GH'));
  assert.equal(Countries.getByContinent('XX').length, 0);
  const us = Countries.get('US');
  assert.equal(us.timezones[0], 'America/New_York');
  assert.ok(us.timezones.includes('Pacific/Honolulu'));
});

test('states', () => {
  const gh = States.getByCountry('GH');
  assert.equal(gh.length, 16);
  const accra = States.get('GH-AA');
  assert.equal(accra.name, 'Greater Accra');
  assert.equal(accra.country, 'GH');
  assert.equal(accra.timezone, 'Africa/Accra');
  assert.ok(km(accra.coordinates, { lat: 5.8, lng: -0.1 }) < 40, JSON.stringify(accra.coordinates));
  assert.equal(States.getByCountry('KE').length, 47);
  assert.equal(States.getByCountry('NG').length, 37);
  assert.equal(States.getByCountry('US').length, 51);
  assert.ok(States.get('CN-TW'));
  assert.equal(States.get('RU-MOW').timezone, 'Europe/Moscow');
  for (const s of States.getAll) {
    assert.ok(s.coordinates, `${s.iso} has no centre`);
    assert.ok(s.timezone, `${s.iso} has no time zone`);
  }
  assert.ok(States.getByContinent('AF').length > 700);
});

test('cities by country / state', async () => {
  const gh = await Cities.getByCountry('GH');
  assert.ok(gh.length > 150, `only ${gh.length} Ghanaian cities`);
  const accra = gh.find((c) => c.name === 'Accra');
  const kumasi = gh.find((c) => c.name === 'Kumasi');
  assert.equal(accra.state, 'GH-AA');
  assert.equal(kumasi.state, 'GH-AH');
  assert.ok(km(accra.coordinates, { lat: 5.556, lng: -0.197 }) < 5);
  assert.ok(km(kumasi.coordinates, { lat: 6.688, lng: -1.624 }) < 5);
  assert.equal(accra.timezone, 'Africa/Accra');
  const ashanti = await Cities.getByState('GH-AH');
  assert.ok(ashanti.length > 10 && ashanti.every((c) => c.state === 'GH-AH'));
  const ids = new Set(gh.map((c) => c.id));
  assert.equal(ids.size, gh.length);
  assert.deepEqual(await Cities.getByCountry('XX'), []);
  assert.deepEqual(await Cities.getByState('GH-ZZ'), []);
});

test('folded territories', async () => {
  const taipei = (await Cities.getByState('CN-TW')).find((c) => c.name === 'Taipei');
  assert.ok(taipei);
  assert.equal(taipei.country, 'CN');
  assert.equal(taipei.timezone, 'Asia/Taipei');
});

test('translations', async () => {
  assert.ok(supportedLanguages.includes('fr'));
  await loadLanguage('fr');
  assert.equal(Countries.get('DE', { language: 'fr' }).name, 'Allemagne');
  assert.equal(Continents.get('AF', { language: 'fr' }).name, 'Afrique');
  assert.equal(Countries.get('DE').name, 'Germany');
  const ru = await Cities.getByCountry('DE', { language: 'ru' });
  assert.ok(ru.some((c) => c.name === 'Берлин'));
  await assert.rejects(loadLanguage('xx'));
});

test('time zones', () => {
  assert.equal(Timezones.getOffset('Asia/Kolkata'), 330);
  assert.equal(Timezones.getOffsetString('Africa/Accra'), '+00:00');
  assert.equal(Timezones.getOffset('America/New_York', new Date('2025-01-15T12:00:00Z')), -300);
  assert.equal(Timezones.getOffset('America/New_York', new Date('2025-07-15T12:00:00Z')), -240);
  assert.deepEqual(Timezones.getByCountry('GH'), ['Africa/Accra']);
  const all = new Set(Timezones.getAll);
  for (const c of Countries.getAll) for (const z of c.timezones) assert.ok(all.has(z), z);
  for (const z of all) assert.doesNotThrow(() => new Intl.DateTimeFormat('en', { timeZone: z }), z);
});
