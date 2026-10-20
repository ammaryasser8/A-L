import test from 'node:test';
import assert from 'node:assert/strict';
import { requireCoFounder } from '../src/middleware/auth.js';

test('unauthenticated administrative access is rejected before database access', async () => {
  let status; let body; let continued = false;
  const res = { status(code) { status = code; return this; }, json(value) { body = value; return this; } };
  await requireCoFounder({}, res, () => { continued = true; });
  assert.equal(status, 401);
  assert.equal(body.error, 'Authentication required.');
  assert.equal(continued, false);
});

test('a suspended co-founder cannot use administrative APIs', async () => {
  let status; let body; let continued = false;
  const res = { status(code) { status = code; return this; }, json(value) { body = value; return this; } };
  await requireCoFounder({ user: { status: 'suspended', roles: [{ role: 'co_founder_developer' }] } }, res, () => { continued = true; });
  assert.equal(status, 403);
  assert.equal(body.error, 'This account is unavailable.');
  assert.equal(continued, false);
});
