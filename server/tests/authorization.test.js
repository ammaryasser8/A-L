import test from 'node:test';
import assert from 'node:assert/strict';
import { ADMIN_PERMISSIONS, ADMIN_ROLE, ADMIN_TITLE, safeUser } from '../src/services/presenter.js';

function coFounder(id, email) {
  return { id, email, firstName: 'AL', lastName: 'Builder', status: 'active', profile: {}, membership: { tier: 'guest', status: 'active' }, roles: [{ role: ADMIN_ROLE }] };
}

test('the two designated co-founder identities have identical effective capabilities', () => {
  const owner = safeUser(coFounder('one', 'owner@example.test'));
  const lekaa = safeUser(coFounder('two', 'lekaa@example.test'));
  assert.deepEqual(owner.administrativeIdentity, lekaa.administrativeIdentity);
  assert.equal(owner.administrativeIdentity.role, ADMIN_ROLE);
  assert.equal(owner.administrativeIdentity.title, ADMIN_TITLE);
  assert.deepEqual(owner.administrativeIdentity.permissions, ADMIN_PERMISSIONS);
});

test('customer membership does not create an administrative identity', () => {
  const privilegeGuest = safeUser({ id: 'guest', email: 'guest@example.test', firstName: 'Guest', lastName: 'Only', status: 'active', profile: {}, membership: { tier: 'privilege', status: 'active' }, roles: [] });
  assert.equal(privilegeGuest.administrativeIdentity, null);
});
