import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import hotels from '../data/hotels.json';
import products from '../data/products.json';
import extras from '../data/mock/extras.json';
import { reservationService } from '../services/reservationService';
import JourneyTimeline from '../components/account/JourneyTimeline';
import LoadingState from '../components/ui/LoadingState';
import styles from './AccountPage.module.css';

export default function ReservationDetailPage() {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    reservationService.getReservationById(reservationId)
      .then((result) => { if (!cancelled) setReservation(result); })
      .catch(() => { if (!cancelled) setNotFound(true); });
    return () => { cancelled = true; };
  }, [reservationId]);

  if (notFound) return <Navigate to="/account/reservations" replace />;
  if (!reservation) return <LoadingState />;

  const hotel = hotels.find((entry) => entry.id === reservation.hotelId);
  const room = products.find((product) => product.id === reservation.roomId);
  const selectedExtras = extras.filter((extra) => (reservation.extraIds || []).includes(extra.id));

  return (
    <div className={styles.account}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
        <Link to="/account/reservations" className={styles.logout}>All reservations</Link>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>{reservation.id}</p>
        <h1>{hotel?.shortName}</h1>
        <p className={styles.sub}>{room?.title} · {reservation.checkIn} — {reservation.checkOut}</p>
      </section>

      <section className={styles.panel} style={{ maxWidth: 760 }}>
        <h2>Your journey</h2>
        <JourneyTimeline journey={reservation.journey} />

        <nav className={styles.quickLinks} style={{ padding: '24px 0 0' }}>
          <Link to={`/account/reservations/${reservation.id}/pre-arrival`}>Prepare for arrival</Link>
          <Link to={`/account/reservations/${reservation.id}/check-in`}>Digital check-in</Link>
        </nav>
      </section>

      <section className={styles.panel} style={{ maxWidth: 760 }}>
        <h2>Reservation details</h2>
        <dl className={styles.summary}>
          <div className={styles.summaryRow}><dt>Guests</dt><dd>{reservation.guests}</dd></div>
          <div className={styles.summaryRow}><dt>Nights</dt><dd>{reservation.nights}</dd></div>
          <div className={styles.summaryRow}><dt>Room rate</dt><dd>${reservation.pricePerNight?.toFixed(0)} / night</dd></div>
          {selectedExtras.map((extra) => (
            <div className={styles.summaryRow} key={extra.id}><dt>{extra.title}</dt><dd>${extra.price}</dd></div>
          ))}
          <div className={styles.summaryRow}><dt className={styles.total}>Total</dt><dd className={styles.total}>${reservation.total.toFixed(0)}</dd></div>
        </dl>
      </section>
    </div>
  );
}