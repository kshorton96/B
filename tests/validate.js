// Run with node tests/validate.js; no dependencies required.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(m => m[1]);
for (const src of scripts.filter(src => !/^https?:\/\//.test(src))) {
  assert.ok(fs.existsSync(path.join(root, src)), `Missing referenced script: ${src}`);
}
assert.ok(scripts.includes('data/places.js'), 'The record data must be loaded');
assert.ok(scripts.indexOf('data/places.js') < scripts.indexOf('app.js'), 'Load records before app.js');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data/places.js'), 'utf8'), context);
const places = context.window.ATLAS_PLACES;
assert.ok(Array.isArray(places) && places.length > 0, 'Expected a nonempty ATLAS_PLACES array');
const ids = new Set();
for (const p of places) {
  assert.equal(typeof p.id, 'string');
  assert.ok(p.id && !ids.has(p.id), `Duplicate or empty record ID: ${p.id}`);
  ids.add(p.id);
  assert.ok(typeof p.name === 'string' && p.name, `Missing name: ${p.id}`);
  assert.ok(Number.isFinite(p.lat) && Math.abs(p.lat) <= 90, `Invalid latitude: ${p.id}`);
  assert.ok(Number.isFinite(p.lng) && Math.abs(p.lng) <= 180, `Invalid longitude: ${p.id}`);
  assert.ok(['exact', 'approximate', 'unknown'].includes(p.locationAccuracy));
  assert.ok(['draft', 'verified'].includes(p.status));
  assert.ok(Array.isArray(p.people) && Array.isArray(p.sources));
}
console.log(`Validated script references, load order, and ${places.length} records.`);
