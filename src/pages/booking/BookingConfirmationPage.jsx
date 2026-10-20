import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import hotels from '../../data/hotels.json';
import products from '../../data/products.json';
import { reservationService } from '../../services/reservationService';
import BookingSteps from './BookingSteps';
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
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
      </header>
      <BookingSteps current={6} />
      <div className={styles.content}>
        <div className={styles.confirm}>
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
      </div>
    </div>
  );
}