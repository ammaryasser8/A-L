import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import hotels from '../../data/hotels.json';
import products from '../../data/products.json';
import { reservationService } from '../../services/reservationService';
import BookingShell from './BookingShell';
import LoadingState from '../../components/ui/LoadingState';
import styles from './Booking.module.css';

export default function BookingConfirmationPage() {
  const [reservation, setReservation] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const reservationId = sessionStorage.getItem('al-last-reservation-id');

  useEffect(() => {
    if (!reservationId) return undefined;
    let cancelled = false;
    reservationService.getReservationById(reservationId)
      .then((result) => { if (!cancelled) setReservation(result); })
      .catch(() => { if (!cancelled) setNotFound(true); });
    return () => { cancelled = true; };
  }, [reservationId]);

  if (!reservationId || notFound) {
    return <Navigate to="/booking" replace />;
  }
  if (!reservation) {
    return <LoadingState />;
  }

  const hotel = hotels.find((entry) => entry.id === reservation.hotelId);
  const room = products.find((product) => product.id === reservation.roomId);

  return (
    <BookingShell step={6} hotelSlug={hotel?.slug} summary={false}>
      <div className={styles.confirm}>
        <div className={styles.confirmBadge} aria-hidden="true">✓</div>
        <p className={styles.eyebrow}>Your journey is confirmed</p>
        <h1>{hotel?.shortName}</h1>
        <p>{room?.title} · {reservation.checkIn} — {reservation.checkOut}</p>
        <p className={styles.roomAmenities}>Total paid: ${reservation.total.toFixed(0)}</p>
        <div className={styles.confirmId}>{reservation.id}</div>
        <div className={styles.confirmActions}>
          <Link to={`/account/reservations/${reservation.id}`}>View reservation</Link>
          <Link to={`/hotels/${hotel?.slug}`}>Explore {hotel?.shortName}</Link>
          <Link to="/">Return home</Link>
        </div>
      </div>
    </BookingShell>
  );
}
