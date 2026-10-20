import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';
import styles from './BookingBar.module.css';

export default function BookingBar({ variant = 'light', hotelSlug }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 Adults');
  const { updateDraft } = useBooking();
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    updateDraft({ hotelSlug: hotelSlug || null, checkIn, checkOut, guestCount: parseInt(guests, 10) || 2 });
    navigate('/booking');
  }

  return (
    <form
      className={variant === 'glass' ? `${styles.bar} ${styles.glass}` : styles.bar}
      onSubmit={handleSubmit}
    >
      <label className={styles.field}>
        <span>Check-in</span>
        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
      </label>
      <label className={styles.field}>
        <span>Check-out</span>
        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
      </label>
      <label className={styles.field}>
        <span>Guests</span>
        <select value={guests} onChange={(e) => setGuests(e.target.value)}>
          <option>1 Adult</option>
          <option>2 Adults</option>
          <option>2 Adults, 1 Child</option>
          <option>4 Adults</option>
        </select>
      </label>
      <button type="submit" className={styles.submit}>
        Check availability
      </button>
    </form>
  );
}