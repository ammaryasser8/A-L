import { api, setCsrfToken } from './apiClient';

function toSession(user) {
  if (!user) return null;
  const membership = user.membership || { tier: 'guest', status: 'active' };
  const profile = { ...(user.profile || {}), id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, avatar: user.avatar, membershipTier: membership.tier, membershipStatus: membership.status, membershipStartDate: membership.activatedAt, membershipRenewalDate: membership.renewalAt, administrativeIdentity: user.administrativeIdentity };
  return { ...user, membership, profile };
}

export const authService = {
  async login({ email, password }) { const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); setCsrfToken(data.csrfToken); return toSession(data.user); },
  async signup({ firstName, lastName, email, password }) { const data = await api('/auth/register', { method: 'POST', body: JSON.stringify({ firstName, lastName, email, password }) }); setCsrfToken(data.csrfToken); return toSession(data.user); },
  async getSession() { const data = await api('/auth/me'); return toSession(data.user); },
  async updateProfile(updates) { const payload = { phone: updates.phone || null, country: updates.country || null, birthday: updates.birthday || null, language: updates.language || null, preferences: updates.preferences || {} }; const data = await api('/account/profile', { method: 'PATCH', body: JSON.stringify(payload) }); return toSession(data.user); },
  async updateAvatar(file) { const body = new FormData(); body.append('avatar', file); const data = await api('/account/avatar', { method: 'POST', body }); return toSession(data.user); },
  async requestPasswordReset({ email }) { return api('/auth/password-reset', { method: 'POST', body: JSON.stringify({ email }) }); },
  async confirmPasswordReset({ token, password }) { return api('/auth/password-reset/confirm', { method: 'POST', body: JSON.stringify({ token, password }) }); },
  async logout() { await api('/auth/logout', { method: 'POST' }); setCsrfToken(null); },
  async continueWithProvider() { throw new Error('Social sign-in is not configured yet. Please use your AL account email and password.'); },
};
