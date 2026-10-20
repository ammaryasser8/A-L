import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import hotels from '../../data/hotels.json';
import products from '../../data/products.json';
import extras from '../../data/mock/extras.json';
import { useBooking } from '../../hooks/useBooking';
import { useAuth } from '../../hooks/useAuth';
import { reservationService } from '../../services/reservationService';
import { nightsBetween, extrasTotal } from '../../utils/bookingMath';
import BookingSteps from './BookingSteps';
import styles from './Booking.module.css';

/**
 * FRONTEND MOCK PAYMENT ONLY.
 * No card details are sent anywhere or stored — they exist only in this
 * component's state for the length of the mock submission. The single
 * "declined" test number below exists purely to demonstrate the
 * failed/retry path; everything else succeeds.
 */
const DECLINE_TEST_NUMBER = '4000000000000002';

export default function BookingPaymentPage() {
  const { draft, clearDraft } = useBooking();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [card, setCard] = useState({ name: session?.firstName ? `${session.firstName} ${session.lastName}` : '', number: '', expiry: '', cvc: '' });
  const [status, setStatus] = useState('idle'); // idle | processing | failed
  const [error, setError] = useState('');

  if (!draft.hotelSlug || !draft.checkIn || !draft.checkOut || !draft.roomId) {
    return <Navigate to="/booking" replace />;
  }

  const hotel = hotels.find((entry) => entry.slug === draft.hotelSlug);
  const room = products.find((product) => product.id === draft.roomId);
  const stayNights = nightsBetween(draft.checkIn, draft.checkOut);
  const roomTotal = Math.round(room.price * stayNights * 100) / 100;
  const grandTotal = Math.round((roomTotal + extrasTotal(draft.extraIds, extras)) * 100) / 100;

  function update(field) {
    return (event) => setCard((c) => ({ ...c, [field]: event.target.value }));
  }

  async function handlePay(event) {
    event.preventDefault();
    setError('');
    setStatus('processing');

    await new Promise((resolve) => { setTimeout(resolve, 1300); });

    const cardNumber = card.number.replace(/\s+/g, '');
    if (cardNumber === DECLINE_TEST_NUMBER) {
      setStatus('failed');
      setError('Your card was declined. Please try a different card.');
      return;
    }

    try {
      const reservation = await reservationService.createReservation({
        guestId: session.id,
        hotelId: hotel.id,
        roomId: room.id,
        checkIn: draft.checkIn,
        checkOut: draft.checkOut,
        guests: draft.guestCount,
        pricePerNight: room.price,
        extraIds: draft.extraIds || [],
        extrasTotal: extrasTotal(draft.extraIds, extras),
      });
      sessionStorage.setItem('al-last-reservation-id', reservation.id);
      clearDraft();
      navigate('/booking/confirmation');
    } catch (err) {
      setStatus('failed');
      setError(err.message || 'Something went wrong. Please try again.');
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
      </header>
      <BookingSteps current={5} />
      <div className={styles.content}>
        <p className={styles.eyebrow}>Payment · ${grandTotal.toFixed(0)}</p>
        <h1>Complete your booking.</h1>

        {status === 'processing' && (
          <div className={styles.payState}>
            <div className={styles.spinner} aria-hidden="true" />
            <p>Processing your payment…</p>
          </div>
        )}

        {status !== 'processing' && (
          <form className={styles.form} onSubmit={handlePay} noValidate>
            <label className={styles.field}>
              <span>Name on card</span>
              <input required value={card.name} onChange={update('name')} />
            </label>
            <label className={styles.field}>
              <span>Card number</span>
              <input required inputMode="numeric" placeholder="4242 4242 4242 4242" value={card.number} onChange={update('number')} />
            </label>
            <div className={styles.row2}>
              <label className={styles.field}>
                <span>Expiry</span>
                <input required placeholder="MM / YY" value={card.expiry} onChange={update('expiry')} />
              </label>
              <label className={styles.field}>
                <span>CVC</span>
                <input required inputMode="numeric" placeholder="123" value={card.cvc} onChange={update('cvc')} />
              </label>
            </div>

            {status === 'failed' && <p className={styles.error} role="alert">{error}</p>}

            <button type="submit" className={styles.submit}>
              {status === 'failed' ? 'Try again' : `Pay $${grandTotal.toFixed(0)}`}
            </button>
            <p className={styles.roomAmenities}>This is a demo payment — no card is charged. Any number works except {DECLINE_TEST_NUMBER}.</p>
          </form>
        )}
      </div>
    </div>
  );
}