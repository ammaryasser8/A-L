export const ADMIN_ROLE = 'co_founder_developer';
export const ADMIN_TITLE = 'Co-Founder & Developer';
export const ADMIN_PERMISSIONS = Object.freeze(['accounts:inspect', 'accounts:status', 'membership:review', 'audit:read', 'security:read', 'diagnostics:read']);

export function safeUser(user) {
  if (!user) return null;
  const role = user.roles?.some(({ role: value }) => value === ADMIN_ROLE) ? ADMIN_ROLE : null;
  return {
    id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email,
    phone: user.phone, avatar: user.avatarUrl, status: user.status, createdAt: user.createdAt,
    profile: user.profile || {}, membership: user.membership || { tier: 'guest', status: 'active' },
    administrativeIdentity: role ? { role, title: ADMIN_TITLE, permissions: ADMIN_PERMISSIONS } : null,
  };
}

export const userInclude = { profile: true, membership: true, roles: true };
