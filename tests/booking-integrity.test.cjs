const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const db = fs.readFileSync(path.join(__dirname, '../src/lib/db.ts'), 'utf8');
const booking = fs.readFileSync(path.join(__dirname, '../src/app/api/bookings/route.ts'), 'utf8');

test('database migration defines a valid dollar-quoted exclusion block', () => {
  assert.match(db, /DO \$\$ BEGIN/);
  assert.match(db, /END \$\$\x60/);
  assert.match(db, /CREATE EXTENSION IF NOT EXISTS btree_gist/);
  assert.match(db, /EXCLUDE USING gist/);
  assert.match(db, /int4range\(/);
  assert.match(db, /status <> 'cancelled'/);
});

test('booking conflicts return HTTP 409 to clients', () => {
  assert.match(booking, /23P01/);
  assert.match(booking, /status: 409/);
});

test('production refuses ephemeral storage when database is absent', () => {
  assert.match(db, /DATABASE_URL is required for persistent production storage/);
});
