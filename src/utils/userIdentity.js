export function identityVariant(user) {
  if (user?.administrativeIdentity?.role === 'co_founder_developer') return 'developer';
  if (user?.membership?.tier === 'privilege') return 'privilege';
  if (user?.membership?.tier === 'member') return 'member';
  return 'guest';
}
