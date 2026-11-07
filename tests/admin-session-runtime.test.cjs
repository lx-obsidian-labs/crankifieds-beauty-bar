const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function loadAdmin(env, cookieValue) {
  const source = fs.readFileSync(path.join(__dirname, '../src/lib/admin.ts'), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  const sandbox = {
    module, exports: module.exports, Buffer, Date,
    process: { env },
    require(id) {
      if (id === 'next/headers') return { cookies: async () => ({ get: () => cookieValue ? { value: cookieValue } : undefined }) };
      if (id === 'node:crypto') return require(id);
      throw new Error('Unexpected dependency: ' + id);
    },
  };
  vm.runInNewContext(compiled, sandbox, { filename: 'admin.ts', timeout: 1000 });
  return module.exports;
}

const SECRET = 'a'.repeat(48);
const PASSCODE = 'correct-horse-battery-staple';

test('real session token verifies with correct secret, rejects wrong secret and malformed input', () => {
  const auth = loadAdmin({ ADMIN_SESSION_SECRET: SECRET, ADMIN_PASSCODE: PASSCODE });
  const token = auth.tokenFor();
  assert.match(token, /^\d{10}\.[a-f0-9]{64}$/);
  assert.equal(auth.verifyAdminToken(token, SECRET), true);
  assert.equal(auth.verifyAdminToken(token, 'b'.repeat(48)), false);
  assert.equal(auth.verifyAdminToken('malformed', SECRET), false);
  assert.equal(auth.verifyAdminToken(token.slice(0, -1) + (token.endsWith('a') ? 'b' : 'a'), SECRET), false);
});

test('real session token expires and rejects tokens issued too far in the future', () => {
  const auth = loadAdmin({ ADMIN_SESSION_SECRET: SECRET, ADMIN_PASSCODE: PASSCODE });
  const token = auth.tokenFor();
  const issued = Number(token.split('.')[0]);
  assert.equal(auth.verifyAdminToken(token, SECRET, issued + 8 * 60 * 60), true);
  assert.equal(auth.verifyAdminToken(token, SECRET, issued + 8 * 60 * 60 + 1), false);
  assert.equal(auth.verifyAdminToken(token, SECRET, issued - 31), false);
});

test('real admin checks reject missing credentials and short signing secrets', async () => {
  const noSecret = loadAdmin({ ADMIN_PASSCODE: PASSCODE });
  assert.equal(await noSecret.isAdmin(), false);
  assert.throws(() => noSecret.tokenFor(), /ADMIN_SESSION_SECRET/);
  const shortSecret = loadAdmin({ ADMIN_PASSCODE: PASSCODE, ADMIN_SESSION_SECRET: 'short' });
  assert.equal(await shortSecret.isAdmin(), false);
  const noPasscode = loadAdmin({ ADMIN_SESSION_SECRET: SECRET });
  assert.equal(await noPasscode.isAdmin(), false);
  assert.equal(noPasscode.checkPasscode(PASSCODE), false);
});

test('real passcode comparison and authenticated cookie check', async () => {
  const auth = loadAdmin({ ADMIN_SESSION_SECRET: SECRET, ADMIN_PASSCODE: PASSCODE });
  assert.equal(auth.checkPasscode(PASSCODE), true);
  assert.equal(auth.checkPasscode('wrong'), false);
  const token = auth.tokenFor();
  assert.equal(await loadAdmin({ ADMIN_SESSION_SECRET: SECRET, ADMIN_PASSCODE: PASSCODE }, token).isAdmin(), true);
  assert.equal(await loadAdmin({ ADMIN_SESSION_SECRET: SECRET, ADMIN_PASSCODE: PASSCODE }, 'bad-token').isAdmin(), false);
  assert.equal(await loadAdmin({ ADMIN_SESSION_SECRET: SECRET, ADMIN_PASSCODE: PASSCODE }).isAdmin(), false);
});
