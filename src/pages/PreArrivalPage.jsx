import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { reservationService } from '../services/reservationService';
import LoadingState from '../components/ui/LoadingState';
import styles from './AccountPage.module.css';

const TRANSPORT_OPTIONS = ['I\u2019ll arrange my own', 'Private transfer (complimentary with select rooms)', 'Rental car pickup'];
const DINING_OPTIONS = ['No preference', 'Vegetarian', 'Vegan', 'Halal', 'Gluten-free'];

// Five fields make up "prepared" — each one filled moves the needle.
const FIELDS = ['arrivalTime', 'transportation', 'diningPreference', 'specialRequests', 'contactNumber'];

function completion(reservation) {
  const filled = FIELDS.filter((field) => Boolean(reservation?.[field])).length;
  return Math.round((filled / FIELDS.length) * 100);
}

export default function PreArrivalPage() {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    reservationService.getReservationById(reservationId)
      .then((result) => { if (!cancelled) setReservation(result); })
      .catch(() => { if (!cancelled) setNotFound(true); });
    return () => { cancelled = true; };
  }, [reservationId]);

  if (notFound) return <Navigate to="/account/reservations" replace />;
  if (!reservation) return <LoadingState />;

  function update(field) {
    return (event) => setReservation((r) => ({ ...r, [field]: event.target.value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    const percent = completion(reservation);
    const journey = percent >= 60 && reservation.journey === 'confirmed' ? 'preparing' : reservation.journey;
    const updated = await reservationService.updateReservation(reservation.id, {
      arrivalTime: reservation.arrivalTime || '',
      transportation: reservation.transportation || '',
      diningPreference: reservation.diningPreference || '',
      specialRequests: reservation.specialRequests || '',
      contactNumber: reservation.contactNumber || '',
      journey,
    });
    setReservation(updated);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const percent = completion(reservation);

  return (
    <div className={styles.account}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
        <Link to={`/account/reservations/${reservation.id}`} className={styles.logout}>Back to reservation</Link>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>{reservation.id}</p>
        <h1>Your arrival.</h1>
        <p className={styles.sub}>Your arrival is {percent}% prepared.</p>
        <div className={styles.progressTrack}><div className={styles.progressFill} style={{ width: `${percent}%` }} /></div>
      </section>

      <section className={styles.panel} style={{ maxWidth: 640 }}>
        <form className={styles.reservationForm} onSubmit={handleSave}>
          <label className={styles.formField}>
            <span>Estimated arrival time</span>
            <input type="time" value={reservation.arrivalTime || ''} onChange={update('arrivalTime')} />
          </label>
          <label className={styles.formField}>
            <span>Transportation</span>
            <select value={reservation.transportation || ''} onChange={update('transportation')}>
              <option value="">Choose an option</option>
              {TRANSPORT_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className={styles.formField}>
            <span>Dining preference</span>
            <select value={reservation.diningPreference || ''} onChange={update('diningPreference')}>
              <option value="">Choose an option</option>
              {DINING_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className={styles.formField}>
            <span>Contact number for arrival day</span>
            <input type="tel" value={reservation.contactNumber || ''} onChange={update('contactNumber')} placeholder="+20 ..." />
          </label>
          <label className={styles.formField}>
            <span>Anything else we should know?</span>
            <textarea rows={4} value={reservation.specialRequests || ''} onChange={update('specialRequests')} placeholder="Celebrating something? Travelling with an infant? Let us know." />
          </label>
          <button type="submit" className={styles.formSubmit} disabled={saving}>
            {saving ? 'Saving…' : saved ? 'Saved' : 'Save preferences'}
          </button>
        </form>
      </section>
    </div>
  );
}