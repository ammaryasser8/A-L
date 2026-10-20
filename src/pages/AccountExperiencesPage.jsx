import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import hotels from '../data/hotels.json';
import products from '../data/products.json';
import { useAuth } from '../hooks/useAuth';
import { experienceService } from '../services/experienceService';
import styles from './AccountPage.module.css';

export default function AccountExperiencesPage() {
  const { session } = useAuth();
  const [bookings, setBookings] = useState(null);

  useEffect(() => {
    let cancelled = false;
    experienceService.getBookingsForGuest(session.id).then((list) => { if (!cancelled) setBookings(list); });
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
        <h1>Dining, spa &amp; experiences.</h1>
      </section>
      <section className={styles.panel} style={{ maxWidth: 720 }}>
        {bookings === null && <p>Loading…</p>}
        {bookings?.length === 0 && (
          <div className={styles.empty}>
            <p>No bookings yet.</p>
            <p className={styles.emptySub}>Reserve a table, a spa ritual or an experience from any hotel page.</p>
          </div>
        )}
        {bookings?.length > 0 && (
          <div className={styles.requestList}>
            {bookings.map((booking) => {
              const hotel = hotels.find((entry) => entry.id === booking.hotelId);
              const product = products.find((entry) => entry.id === booking.productId);
              return (
                <article key={booking.id} className={styles.requestCard}>
                  <div>
                    <p className={styles.reservationHotel}>{hotel?.shortName} · {product?.category}</p>
                    <p className={styles.requestMessage}>{product?.title}</p>
                    <p className={styles.reservationId}>{booking.date} at {booking.time} · {booking.guests} guests</p>
                  </div>
                  <span className={styles.status}>{booking.status}</span>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}