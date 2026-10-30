import { Link } from 'react-router-dom';
import hotels from '../../data/hotels.json';
import products from '../../data/products.json';
import extras from '../../data/mock/extras.json';
import { useBooking } from '../../hooks/useBooking';
import { nightsBetween, extrasTotal } from '../../utils/bookingMath';
import BookingSteps from './BookingSteps';
import styles from './Booking.module.css';

const THEME_IMAGE = { aurelia: '/images/products/7-1.jpg', marisol: '/images/products/101-1.jpg' };

/**
 * Shared frame for every booking step: colourful animated backdrop that
 * follows the chosen hotel (Aurelia = wine & gold, Marisol = teal & emerald),
 * the step tracker, the content card and a live "your stay" summary.
 */
export default function BookingShell({ step, hotelSlug, eyebrow, title, children, summary = true }) {
  const { draft } = useBooking();
  const slug = hotelSlug || draft.hotelSlug || hotels[0].slug;
  const theme = slug.startsWith('marisol') ? 'marisol' : 'aurelia';
  const hotel = hotels.find((entry) => entry.slug === slug);

  const sameHotel = draft.hotelSlug === slug;
  const room = sameHotel && draft.roomId ? products.find((product) => product.id === draft.roomId) : null;
  const validDates = draft.checkIn && draft.checkOut && new Date(draft.checkOut) > new Date(draft.checkIn);
  const nights = sameHotel && validDates ? nightsBetween(draft.checkIn, draft.checkOut) : 0;
  const extrasSum = sameHotel ? extrasTotal(draft.extraIds, extras) : 0;
  const total = room && nights ? Math.round((room.price * nights + extrasSum) * 100) / 100 : null;

  return (
    <div className={`${styles.page} ${styles[theme]}`}>
      <div className={styles.aurora} aria-hidden="true"><i /><i /><i /></div>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
        <Link to={`/hotels/${slug}`} className={styles.headerLink}>← {hotel?.shortName}</Link>
      </header>
      <BookingSteps current={step} />
      <div className={`${styles.layout} ${summary ? '' : styles.layoutSolo}`}>
        <main className={styles.content}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          {title && <h1>{title}</h1>}
          {children}
        </main>
        {summary && (
          <aside className={styles.summaryCard} aria-label="Your stay">
            <div className={styles.summaryImage} style={{ backgroundImage: `url(${THEME_IMAGE[theme]})` }}>
              <span>{hotel?.type}</span>
              <strong>{hotel?.name}</strong>
            </div>
            <dl className={styles.summaryList}>
              <div><dt>Check-in</dt><dd>{draft.checkIn && sameHotel ? draft.checkIn : '—'}</dd></div>
              <div><dt>Check-out</dt><dd>{draft.checkOut && sameHotel ? draft.checkOut : '—'}</dd></div>
              <div><dt>Guests</dt><dd>{sameHotel && draft.guestCount ? draft.guestCount : '—'}</dd></div>
              {nights > 0 && <div><dt>Nights</dt><dd>{nights}</dd></div>}
              {room && <div><dt>Room</dt><dd>{room.title}</dd></div>}
            </dl>
            <div className={styles.summaryTotal}>
              <span>{total ? 'Estimated total' : 'Choose a room to see your total'}</span>
              {total ? <strong>${total.toFixed(0)}</strong> : null}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
