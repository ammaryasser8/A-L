import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import hotels from '../../data/hotels.json';
import { useBooking } from '../../hooks/useBooking';
import BookingSteps from './BookingSteps';
import styles from './Booking.module.css';

export default function BookingStayPage() {
  const { draft, updateDraft } = useBooking();
  const navigate = useNavigate();
  const [hotelSlug, setHotelSlug] = useState(draft.hotelSlug || hotels[0].slug);
  const [checkIn, setCheckIn] = useState(draft.checkIn || '');
  const [checkOut, setCheckOut] = useState(draft.checkOut || '');
  const [guests, setGuests] = useState(draft.guestCount || 2);
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!checkIn || !checkOut) {
      setError('Please choose both a check-in and check-out date.');
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Check-out should be after check-in.');
      return;
    }
    setError('');
    updateDraft({ hotelSlug, checkIn, checkOut, guestCount: Number(guests), roomId: null });
    navigate('/booking/room');
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
      </header>
      <BookingSteps current={1} />
      <div className={styles.content}>
        <p className={styles.eyebrow}>Booking</p>
        <h1>Compose your stay.</h1>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.field}>
            <span>Destination</span>
            <select value={hotelSlug} onChange={(event) => setHotelSlug(event.target.value)}>
              {hotels.map((hotel) => <option key={hotel.slug} value={hotel.slug}>{hotel.name}</option>)}
            </select>
          </label>
          <div className={styles.row2}>
            <label className={styles.field}>
              <span>Check-in</span>
              <input type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Check-out</span>
              <input type="date" value={checkOut} onChange={(event) => setCheckOut(event.target.value)} />
            </label>
          </div>
          <label className={styles.field}>
            <span>Guests</span>
            <input type="number" min="1" max="8" value={guests} onChange={(event) => setGuests(event.target.value)} />
          </label>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <button type="submit" className={styles.submit}>Choose a room</button>
        </form>
      </div>
    </div>
  );
}