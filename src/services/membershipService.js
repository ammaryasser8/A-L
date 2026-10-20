export const MEMBERSHIP_PLANS = {
  guest: { label: 'AL Guest', price: 0, support: 'Standard guest support', benefits: ['Personalized offers', 'Saved collection', 'Guest documents'] },
  member: { label: 'AL Member', price: 28, support: 'Priority handling compared with standard guest requests', benefits: ['Member rates on selected stays', 'Priority support', 'Early access to selected offers', 'Personalized recommendations'] },
  privilege: { label: 'AL Privilege', price: 72, support: 'Elevated concierge priority', benefits: ['All AL Member benefits', 'Priority concierge', 'Preferred experiences', 'Privilege-only invitations'] },
};

// Membership state is authoritative only when it comes from the authenticated
// API session. Payment and billing are intentionally not implemented here.
export const membershipService = {
  getPlan(tier = 'guest') { return MEMBERSHIP_PLANS[tier] || MEMBERSHIP_PLANS.guest; },
  getMembership(profile) {
    const tier = profile?.membershipTier || 'guest';
    return { tier, status: profile?.membershipStatus || 'active', plan: this.getPlan(tier) };
  },
};
