import { Navigate, useNavigate } from 'react-router-dom';
import hotels from '../../data/hotels.json';
import products from '../../data/products.json';
import extras from '../../data/mock/extras.json';
import { useBooking } from '../../hooks/useBooking';
import { nightsBetween, extrasTotal } from '../../utils/bookingMath';
import BookingShell from './BookingShell';
import styles from './Booking.module.css';

export default function BookingReviewPage() {
  const { draft } = useBooking();
  const navigate = useNavigate();

  if (!draft.hotelSlug || !draft.checkIn || !draft.checkOut || !draft.roomId) {
    return <Navigate to="/booking" replace />;
  }

  const hotel = hotels.find((entry) => entry.slug === draft.hotelSlug);
  const room = products.find((product) => product.id === draft.roomId);
  const stayNights = nightsBetween(draft.checkIn, draft.checkOut);
  const roomTotal = Math.round(room.price * stayNights * 100) / 100;
  const selectedExtras = extras.filter((extra) => (draft.extraIds || []).includes(extra.id));
  const extrasSum = extrasTotal(draft.extraIds, extras);
  const grandTotal = Math.round((roomTotal + extrasSum) * 100) / 100;

  return (
    <BookingShell step={4} hotelSlug={hotel.slug} eyebrow={<>Review</>} title={<>Confirm your stay.</>}>
        <dl className={styles.summary}>
          <div className={styles.summaryRow}><dt>Destination</dt><dd>{hotel.shortName}</dd></div>
          <div className={styles.summaryRow}><dt>Room</dt><dd>{room.title}</dd></div>
          <div className={styles.summaryRow}><dt>Check-in</dt><dd>{draft.checkIn}</dd></div>
          <div className={styles.summaryRow}><dt>Check-out</dt><dd>{draft.checkOut}</dd></div>
          <div className={styles.summaryRow}><dt>Nights</dt><dd>{stayNights}</dd></div>
          <div className={styles.summaryRow}><dt>Guests</dt><dd>{draft.guestCount}</dd></div>
          <div className={styles.summaryRow}><dt>Room rate</dt><dd>${room.price.toFixed(0)} / night · ${roomTotal.toFixed(0)}</dd></div>
          {selectedExtras.map((extra) => (
            <div className={styles.summaryRow} key={extra.id}><dt>{extra.title}</dt><dd>${extra.price}</dd></div>
          ))}
          <div className={styles.summaryRow}><dt className={styles.total}>Total</dt><dd className={styles.total}>${grandTotal.toFixed(0)}</dd></div>
        </dl>
        <button type="button" className={styles.submit} onClick={() => navigate('/booking/payment')}>
          Proceed to payment
        </button>
    </BookingShell>
  );
}
