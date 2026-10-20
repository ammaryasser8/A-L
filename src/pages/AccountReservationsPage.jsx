import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import hotels from '../data/hotels.json';
import products from '../data/products.json';
import { useAuth } from '../hooks/useAuth';
import { reservationService } from '../services/reservationService';
import styles from './AccountPage.module.css';

export default function AccountReservationsPage() {
  const { session } = useAuth();
  const [reservations, setReservations] = useState(null);

  useEffect(() => {
    let cancelled = false;
    reservationService.getReservationsForGuest(session.id).then((list) => {
      if (!cancelled) setReservations(list);
    });
    return () => { cancelled = true; };
  }, [session.id]);

  return (
    <div className={styles.account}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
        <Link to="/account" className={styles.logout}>Back to account</Link>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>AL Guest</p>
        <h1>Your reservations.</h1>
      </section>

      <section className={styles.panel} style={{ maxWidth: 820 }}>
        {reservations === null && <p>Loading…</p>}
        {reservations?.length === 0 && (
          <div className={styles.empty}>
            <p>No reservations yet.</p>
            <p className={styles.emptySub}>When you book a stay at Aurelia or Marisol, it will appear here.</p>
            <div className={styles.emptyActions}>
              <Link to="/booking" className={styles.emptyLink}>Book a stay</Link>
            </div>
          </div>
        )}
        {reservations?.length > 0 && (
          <div className={styles.reservationList}>
            {reservations.map((reservation) => {
              const hotel = hotels.find((entry) => entry.id === reservation.hotelId);
              const room = products.find((product) => product.id === reservation.roomId);
              return (
                <Link key={reservation.id} to={`/account/reservations/${reservation.id}`} className={styles.reservationCard}>
                  <img src={`/${room?.images?.[0]}`} alt=""  loading="lazy" />
                  <div>
                    <p className={styles.reservationHotel}>{hotel?.shortName}</p>
                    <h3>{room?.title}</h3>
                    <p className={styles.reservationMeta}>{reservation.checkIn} — {reservation.checkOut} · {reservation.nights} nights · {reservation.guests} guests</p>
                    <p className={styles.reservationId}>{reservation.id} · <span className={styles.status}>{reservation.status}</span></p>
                  </div>
                  <div className={styles.reservationTotal}>${reservation.total.toFixed(0)}</div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}