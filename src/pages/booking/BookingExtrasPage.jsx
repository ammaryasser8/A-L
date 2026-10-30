import { Navigate, useNavigate } from 'react-router-dom';
import hotels from '../../data/hotels.json';
import extras from '../../data/mock/extras.json';
import { useBooking } from '../../hooks/useBooking';
import BookingShell from './BookingShell';
import styles from './Booking.module.css';

export default function BookingExtrasPage() {
  const { draft, updateDraft } = useBooking();
  const navigate = useNavigate();

  if (!draft.hotelSlug || !draft.checkIn || !draft.checkOut || !draft.roomId) {
    return <Navigate to="/booking" replace />;
  }

  const hotel = hotels.find((entry) => entry.slug === draft.hotelSlug);
  const selected = draft.extraIds || [];

  function toggle(id) {
    const next = selected.includes(id) ? selected.filter((entry) => entry !== id) : [...selected, id];
    updateDraft({ extraIds: next });
  }

  return (
    <BookingShell step={3} hotelSlug={hotel?.slug} eyebrow={<>{hotel?.shortName}</>} title={<>Enhance your stay.</>}>
        <div className={styles.extrasList}>
          {extras.map((extra) => {
            const active = selected.includes(extra.id);
            return (
              <button
                type="button"
                key={extra.id}
                className={active ? `${styles.extraCard} ${styles.extraActive}` : styles.extraCard}
                onClick={() => toggle(extra.id)}
                aria-pressed={active}
              >
                <div>
                  <h3>{extra.title}</h3>
                  <p>{extra.description}</p>
                </div>
                <div className={styles.extraPrice}>
                  <strong>${extra.price}</strong>
                  <span>{extra.unit}</span>
                </div>
                <span className={styles.extraCheck} aria-hidden="true">{active ? '✓' : ''}</span>
              </button>
            );
          })}
        </div>
        <button type="button" className={styles.submit} onClick={() => navigate('/booking/review')}>
          Continue to review
        </button>
    </BookingShell>
  );
}
