import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import hotels from '../data/hotels.json';
import products from '../data/products.json';
import { useAuth } from '../hooks/useAuth';
import { reservationService } from '../services/reservationService';
import LoadingState from '../components/ui/LoadingState';
import styles from './AccountPage.module.css';

const STEPS = ['Reservation', 'Guest information', 'Arrival time', 'Preferences', 'Confirmation'];

export default function CheckInPage() {
  const { reservationId } = useParams();
  const { session } = useAuth();
  const [reservation, setReservation] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [step, setStep] = useState(0);
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '' });
  const [arrivalTime, setArrivalTime] = useState('');
  const [preferences, setPreferences] = useState('');
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    reservationService.getReservationById(reservationId)
      .then((result) => {
        if (cancelled) return;
        setReservation(result);
        setArrivalTime(result.arrivalTime || '');
        setPreferences(result.specialRequests || '');
        setGuestInfo({ name: `${session.firstName} ${session.lastName}`, email: session.email });
        // Starting check-in is itself a real journey milestone.
        if (result.journey === 'confirmed' || result.journey === 'preparing') {
          reservationService.updateReservation(result.id, { journey: 'arrival' });
        }
      })
      .catch(() => { if (!cancelled) setNotFound(true); });
    return () => { cancelled = true; };
  }, [reservationId, session]);

  if (notFound) return <Navigate to="/account/reservations" replace />;
  if (!reservation) return <LoadingState />;

  const hotel = hotels.find((entry) => entry.id === reservation.hotelId);
  const room = products.find((product) => product.id === reservation.roomId);

  async function handleComplete() {
    setCompleting(true);
    await reservationService.updateReservation(reservation.id, {
      arrivalTime,
      specialRequests: preferences,
      journey: 'checked-in',
      checkedInAt: new Date().toISOString(),
    });
    setCompleting(false);
    setStep(4);
  }

  return (
    <div className={styles.account}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
        <Link to={`/account/reservations/${reservation.id}`} className={styles.logout}>Back to reservation</Link>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Digital check-in</p>
        <h1>{hotel?.shortName}</h1>
        <p className={styles.sub}>{STEPS[step]}</p>
      </section>

      <section className={styles.panel} style={{ maxWidth: 640 }}>
        {step === 0 && (
          <div>
            <dl className={styles.summary}>
              <div className={styles.summaryRow}><dt>Reservation</dt><dd>{reservation.id}</dd></div>
              <div className={styles.summaryRow}><dt>Room</dt><dd>{room?.title}</dd></div>
              <div className={styles.summaryRow}><dt>Dates</dt><dd>{reservation.checkIn} — {reservation.checkOut}</dd></div>
            </dl>
            <button type="button" className={styles.formSubmit} style={{ marginTop: 20 }} onClick={() => setStep(1)}>Continue</button>
          </div>
        )}

        {step === 1 && (
          <div className={styles.reservationForm}>
            <label className={styles.formField}><span>Full name</span><input value={guestInfo.name} onChange={(e) => setGuestInfo((g) => ({ ...g, name: e.target.value }))} /></label>
            <label className={styles.formField}><span>Email</span><input value={guestInfo.email} onChange={(e) => setGuestInfo((g) => ({ ...g, email: e.target.value }))} /></label>
            <button type="button" className={styles.formSubmit} onClick={() => setStep(2)}>Continue</button>
          </div>
        )}

        {step === 2 && (
          <div className={styles.reservationForm}>
            <label className={styles.formField}><span>Estimated arrival time</span><input type="time" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} /></label>
            <button type="button" className={styles.formSubmit} onClick={() => setStep(3)}>Continue</button>
          </div>
        )}

        {step === 3 && (
          <div className={styles.reservationForm}>
            <label className={styles.formField}>
              <span>Anything we should prepare?</span>
              <textarea rows={4} value={preferences} onChange={(e) => setPreferences(e.target.value)} />
            </label>
            <button type="button" className={styles.formSubmit} disabled={completing} onClick={handleComplete}>
              {completing ? 'Completing…' : 'Complete check-in'}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className={styles.confirm}>
            <h1>You&rsquo;re checked in.</h1>
            <p>We&rsquo;ll see you soon at {hotel?.shortName}.</p>
            <div className={styles.confirmActions}>
              <Link to={`/account/reservations/${reservation.id}`}>Back to reservation</Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}