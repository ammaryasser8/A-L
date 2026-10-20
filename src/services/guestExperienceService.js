import products from '../data/products.json';
import { membershipService } from './membershipService';

export function getGuestGreeting(profile, upcomingReservation) {
  if (profile?.membershipTier === 'privilege' && profile.membershipStatus === 'active') return 'Welcome back, Privilege Member.';
  if (upcomingReservation) return 'Your next journey awaits.';
  if ((profile?.visitCount || 0) > 1) return 'Welcome back.';
  return 'Welcome to AL Hospitality.';
}

export function getRequestPriority(profile) {
  if (profile?.membershipTier === 'privilege' && profile.membershipStatus === 'active') return 'High priority';
  if (profile?.membershipTier === 'member' && profile.membershipStatus === 'active') return 'Priority';
  return 'Standard';
}

export function getMembershipCta(profile) {
  if (profile?.membershipStatus === 'cancelled') return 'Resume Membership';
  if (profile?.membershipStatus === 'expired') return 'Renew Membership';
  if (profile?.membershipTier === 'privilege') return 'Your Privileges';
  if (profile?.membershipTier === 'member') return 'Manage Membership';
  return 'Explore Membership';
}

export function getPersonalizedOffers(profile, favorites = []) {
  const tier = profile?.membershipTier || 'guest';
  const favoriteIds = new Set(favorites.map((item) => item.productId));
  const favorite = products.find((item) => favoriteIds.has(item.id));
  const offers = [{ id: 'first-journey', title: 'A considered first arrival', detail: 'A private welcome amenity on selected first stays.', eligibility: 'Available to AL Guests', cta: 'Discover offer', image: '/images/sections/marisol-promo-banner.jpg' }];
  if (favorite) offers.push({ id: `saved-${favorite.id}`, title: `A closer look at ${favorite.title}`, detail: 'A tailored invitation based on a moment you saved.', eligibility: 'Your saved collection', cta: 'Return to your collection', image: `/${favorite.images[0]}` });
  if (tier !== 'guest' && profile?.membershipStatus === 'active') offers.push({ id: 'member-rate', title: 'Your member advantage', detail: 'Priority access to selected stays and experiences.', eligibility: membershipService.getPlan(tier).label, cta: tier === 'privilege' ? 'Claim privilege' : 'Unlock member rate', image: '/images/sections/marisol-highlight-views.jpg' });
  return offers;
}
