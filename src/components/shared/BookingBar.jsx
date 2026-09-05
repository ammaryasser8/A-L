import { useState } from 'react';
import styles from './BookingBar.module.css';

export default function BookingBar({ variant = 'light' }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 Adults');

  function handleSubmit(e) {
    e.preventDefault();
    // No backend yet — this is a UI-only placeholder.
    // eslint-disable-next-line no-alert
    alert(`Checking availability: ${checkIn || '—'} to ${checkOut || '—'}, ${guests}`);
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