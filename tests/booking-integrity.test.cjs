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

const statusRoute = fs.readFileSync(path.join(__dirname, '../src/app/api/admin/status/route.ts'), 'utf8');

test('administrator status mutation requires both authentication and trusted origin', () => {
  assert.match(statusRoute, /export async function PATCH\(request: Request\)/);
  assert.match(statusRoute, /origin !== new URL\(request\.url\)\.origin/);
  assert.match(statusRoute, /fetchSite !== "same-origin"/);
  assert.match(statusRoute, /await isAdmin\(\)/);
});

const limiter = fs.readFileSync(path.join(__dirname, '../src/lib/rate-limit.ts'), 'utf8');

test('process-local limiter bounds the number of tracked clients', () => {
  assert.match(limiter, /const MAX_BUCKETS = 5000/);
  assert.match(limiter, /if \(buckets\.size >= MAX_BUCKETS\)/);
  assert.match(limiter, /allowed: false, retryAfter:/);
  assert.doesNotMatch(limiter, /buckets\.delete\(oldest\)/);
  assert.match(limiter, /bucket\.resetAt <= now/);
});

test('admin session token pattern uses real digit and separator escapes', () => {
  assert.ok(admin.includes(String.raw`/^\d{10}\.[a-f0-9]{64}$/`));
  assert.ok(!admin.includes(String.raw`/^\\d{10}\\.[a-f0-9]{64}$/`));
});

const nextConfig = fs.readFileSync(path.join(__dirname, '../next.config.ts'), 'utf8');

test('Next.js defines baseline response security headers', () => {
  for (const header of ['X-Content-Type-Options', 'Referrer-Policy', 'X-Frame-Options', 'Permissions-Policy', 'Cross-Origin-Opener-Policy']) {
    assert.ok(nextConfig.includes(header), `Missing security header: ${header}`);
  }
});

test('administrator API responses are marked non-cacheable', () => {
  assert.match(nextConfig, /source: "\/api\/admin\/:path\*"/);
  assert.match(nextConfig, /Cache-Control", value: "no-store, private"/);
  assert.match(nextConfig, /Pragma", value: "no-cache"/);
});

test('authenticated administrator dashboard HTML is not cacheable', () => {
  assert.match(nextConfig, /source: "\/admin"/);
  assert.match(nextConfig, /Cache-Control", value: "private, no-store, max-age=0"/);
  const adminPage = fs.readFileSync(path.join(__dirname, '../src/app/admin/page.tsx'), 'utf8');
  assert.match(adminPage, /await isAdmin\(\)/);
  assert.match(adminPage, /dynamic = "force-dynamic"/);
});

test('administrator login requires a separate signing secret and handles missing configuration', () => {
  assert.match(admin, /process\.env\.ADMIN_SESSION_SECRET/);
  assert.match(login, /if \(!adminSessionSecret\(\)\)/);
  assert.match(login, /Administrator login is not configured/);
  assert.match(login, /status: 503/);
  assert.match(login, /value: tokenFor\(\)/);
  const example = fs.readFileSync(path.join(__dirname, '../.env.example'), 'utf8');
  assert.match(example, /^ADMIN_SESSION_SECRET=/m);
});

test('rate limiter does not trust forwarded-for by default', () => {
  assert.doesNotMatch(limiter, /headers\.get\("x-forwarded-for"\)/);
  assert.match(limiter, /TRUSTED_CLIENT_IP_HEADER/);
  assert.match(limiter, /"unidentified"/);
});
