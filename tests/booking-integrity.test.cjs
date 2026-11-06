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

const admin = fs.readFileSync(path.join(__dirname, '../src/lib/admin.ts'), 'utf8');
const login = fs.readFileSync(path.join(__dirname, '../src/app/api/admin/login/route.ts'), 'utf8');

test('admin sessions have signed issuance timestamps and bounded lifetime', () => {
  assert.match(admin, /SESSION_SECONDS = 8 \* 60 \* 60/);
  assert.match(admin, /verifyAdminToken/);
  assert.match(admin, /timingSafeEqual/);
  assert.match(admin, /now - issued > SESSION_SECONDS/);
});

test('administrator credentials have no default fallback', () => {
  assert.doesNotMatch(admin, /crankified-studio/);
  assert.match(admin, /process\.env\.ADMIN_PASSCODE/);
});

test('admin login checks request origin', () => {
  assert.match(login, /request\.headers\.get\("origin"\)/);
  assert.match(login, /status: 403/);
});

test('admin login and logout both enforce origin checks', () => {
  assert.match(login, /function trustedMutation\(request: Request\)/);
  assert.match(login, /origin === new URL\(request\.url\)\.origin/);
  assert.match(login, /fetchSite === "same-origin"/);
  assert.match(login, /export async function DELETE\(request: Request\)/);
  assert.match(login, /if \(!trustedMutation\(request\)\)/);
});

test('admin login has both client and process-wide throttles', () => {
  assert.match(login, /rateLimit\("admin-login:all"/);
  assert.match(login, /rateLimit\(clientKey\(request, "admin-login"\)/);
});
