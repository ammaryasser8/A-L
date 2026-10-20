import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import hotels from '../data/hotels.json';
import products from '../data/products.json';
import { useAuth } from '../hooks/useAuth';
import { reservationService } from '../services/reservationService';
import { conciergeService } from '../services/conciergeService';
import { favoritesService } from '../services/favoritesService';
import { reviewService } from '../services/reviewService';
import { guestProfileService } from '../services/guestProfileService';
import { getGuestGreeting, getMembershipCta, getPersonalizedOffers, getRequestPriority } from '../services/guestExperienceService';
import { membershipService } from '../services/membershipService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import ProfileAvatar from '../components/account/ProfileAvatar';
import MembershipBadge from '../components/account/MembershipBadge';
import styles from './GuestPortal.module.css';

function date(value) { return value ? new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) : '—'; }

export default function AccountPage() {
  useDocumentTitle('Your AL Journey');
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    let live = true;
    Promise.all([
      reservationService.getReservationsForGuest(session.id),
      conciergeService.getRequestsForGuest(session.id),
      favoritesService.getFavorites(session.id),
    ]).then(([reservations, requests, favorites]) => {
      if (!live) return;
      const localProfile = guestProfileService.getProfile(session.id) || {};
      // Browser storage retains only legacy journey-only details. Identity,
      // membership, and administrative status always come from the session.
      const profile = {
        ...localProfile,
        ...session.profile,
        avatar: session.profile?.avatar || localProfile.avatar,
        membershipTier: session.membership?.tier || 'guest',
        membershipStatus: session.membership?.status || 'active',
        memberSince: session.membership?.activatedAt || session.createdAt,
      };
      setData({ profile, reservations, requests, favorites, reviews: reviewService.getReviews(session.id) });
    });
    return () => { live = false; };
  }, [session]);

  const summary = useMemo(() => {
    if (!data) return null;
    const now = new Date();
    const upcoming = data.reservations.find((reservation) => new Date(reservation.checkIn) >= now && reservation.status !== 'cancelled');
    const completed = data.reservations.filter((reservation) => new Date(reservation.checkOut) < now && reservation.status !== 'cancelled');
    return { ...data, upcoming, completed, membership: membershipService.getMembership(data.profile), offers: getPersonalizedOffers(data.profile, data.favorites) };
  }, [data]);

  if (!summary) return <main className={styles.loading}>Preparing your private AL journey…</main>;
  const { profile, upcoming, completed, membership, offers, requests, favorites, reviews } = summary;
  const hotel = upcoming && hotels.find((item) => item.id === upcoming.hotelId);
  const room = upcoming && products.find((item) => item.id === upcoming.roomId);
  const completion = guestProfileService.getCompletion(profile);
  const signOut = () => { logout(); navigate('/', { replace: true }); };

  return (
    <main className={styles.portal}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}><img src="/images/brand/al-logo.png" alt="" /> <span>AL Hospitality Group</span></Link>
        <nav aria-label="Your AL account" className={styles.headerNav}>{session.administrativeIdentity?.role === 'co_founder_developer' && <Link to="/developer">Developer center</Link>}<Link to="/account/notifications">Notifications</Link><button type="button" onClick={signOut}>Sign out</button></nav>
      </header>
      <section className={styles.hero}>
        <div className={styles.heroTexture} aria-hidden="true" />
        <div className={styles.identity}>
          <ProfileAvatar user={session} size="small" />
          <div><MembershipBadge user={session} /><h1>{profile.firstName} {profile.lastName}</h1>{session.administrativeIdentity && <Link className="coFounderBadge" to="/developer">Developer center ↗</Link>}<p className={styles.greeting}>{getGuestGreeting(profile, upcoming)} <span>{upcoming ? 'We have your next arrival in view.' : 'Your private guest record is ready to grow with you.'}</span></p></div>
        </div>
        <div className={styles.heroMeta}><span>{membership.plan.label}</span><i /><span>{membership.status === 'active' ? 'Active' : membership.status}</span><i /><span>Since {date(profile.memberSince)}</span></div>
        <div className={styles.heroActions}><Link to="/account/profile">Manage profile</Link><Link to="/account/membership">{getMembershipCta(profile)}</Link></div>
      </section>
      <nav className={styles.sectionNav} aria-label="Guest portal sections"><Link className={styles.active} to="/account">Overview</Link><Link to="/account/profile">Profile & preferences</Link><Link to="/account/collection">Collection</Link><Link to="/account/reservations">Reservations</Link><Link to="/account/requests">Requests</Link><Link to="/account/reviews">Reviews</Link><Link to="/account/membership">Membership</Link><Link to="/account/documents">Documents</Link></nav>
      <section className={styles.dashboard}>
        <div className={styles.leadColumn}>
          <section className={styles.section}>
            <div className={styles.sectionHead}><p className={styles.eyebrow}>Your next chapter</p><Link to="/account/reservations">View all stays ↗</Link></div>
            {upcoming ? <article className={styles.reservationFeature}><img src={`/${room?.images?.[0]}`} alt="" /><div><p>{hotel?.name}</p><h2>{room?.title}</h2><dl><div><dt>Check-in</dt><dd>{date(upcoming.checkIn)}</dd></div><div><dt>Check-out</dt><dd>{date(upcoming.checkOut)}</dd></div><div><dt>Reference</dt><dd>{upcoming.id}</dd></div></dl><div className={styles.inlineActions}><Link to={`/account/reservations/${upcoming.id}`}>View reservation</Link><Link to={`/account/reservations/${upcoming.id}/pre-arrival`}>Pre-arrival</Link></div></div></article> : <article className={styles.firstStay}><p className={styles.eyebrow}>Your first stay</p><h2>A world designed around you.</h2><p>Your reservations, preferences and considered details will gather here as your journey unfolds.</p><Link to="/booking">Explore stays ↗</Link></article>}
          </section>
          <section className={styles.section}>
            <div className={styles.sectionHead}><p className={styles.eyebrow}>Exclusive for you</p><Link to="/account/collection">View collection ↗</Link></div>
            <div className={styles.offerRail}>{offers.map((offer) => <article className={styles.offer} key={offer.id}><img src={offer.image} alt="" loading="lazy" /><div><small>{offer.eligibility}</small><h3>{offer.title}</h3><p>{offer.detail}</p><Link to={offer.id.startsWith('saved') ? '/account/collection' : '/account/membership'}>{offer.cta} ↗</Link></div></article>)}</div>
          </section>
          <section className={styles.section}>
            <div className={styles.sectionHead}><p className={styles.eyebrow}>Your journey</p><Link to="/account/reservations">Reservations ↗</Link></div>
            <ol className={styles.journey}><li><span>{date(profile.memberSince)}</span><p>Joined AL Hospitality</p></li>{favorites.slice(0, 1).map((favorite) => <li key={favorite.productId}><span>{date(favorite.savedAt)}</span><p>Saved a considered moment to your collection</p></li>)}{requests.slice(0, 1).map((request) => <li key={request.id}><span>{date(request.createdAt)}</span><p>Asked our guest team about {request.category.toLowerCase()}</p></li>)}{completed.slice(0, 1).map((reservation) => <li key={reservation.id}><span>{date(reservation.checkOut)}</span><p>Completed an AL stay · {reservation.id}</p></li>)}</ol>
          </section>
        </div>
        <aside className={styles.sideColumn}>
          <section className={styles.statusCard}><p className={styles.eyebrow}>Guest status</p><h2>{completed.length ? 'Returning guest' : 'New guest'}</h2><div className={styles.stats}><div><b>{String(profile.visitCount || 0).padStart(2, '0')}</b><span>Visits</span></div><div><b>{String(completed.length).padStart(2, '0')}</b><span>Stays</span></div><div><b>{String(reviews.length).padStart(2, '0')}</b><span>Reviews</span></div><div><b>{String(favorites.length).padStart(2, '0')}</b><span>Saved</span></div></div></section>
          <section className={styles.membershipCard}><p className={styles.eyebrow}>Membership</p><h2>{membership.plan.label}</h2><p>{membership.plan.support}</p><ul>{membership.plan.benefits.slice(0, 3).map((benefit) => <li key={benefit}>{benefit}</li>)}</ul><Link to="/account/membership">{getMembershipCta(profile)} ↗</Link></section>
          <section className={styles.completion}><p className={styles.eyebrow}>Your profile</p><div><b>{completion}%</b><span>complete</span></div><i><em style={{ width: `${completion}%` }} /></i><p>Complete your preferences to receive more considered recommendations.</p><Link to="/account/profile">Complete profile ↗</Link></section>
          <section className={styles.requestCard}><p className={styles.eyebrow}>Guest team</p><h2>{requests.length ? `${requests.length} request${requests.length > 1 ? 's' : ''} in your journey` : 'Nothing needs your attention.'}</h2><p>{profile.membershipTier === 'privilege' ? 'Your concierge requests receive elevated priority in this mock experience.' : `${getRequestPriority(profile)} support is available whenever you need us.`}</p><Link to="/concierge">Contact concierge ↗</Link></section>
        </aside>
      </section>
    </main>
  );
}
