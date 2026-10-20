import { Link, Navigate, useNavigate } from 'react-router-dom';
import hotels from '../../data/hotels.json';
import products from '../../data/products.json';
import { useBooking } from '../../hooks/useBooking';
import BookingSteps from './BookingSteps';
import styles from './Booking.module.css';

export default function BookingRoomPage() {
  const { draft, updateDraft } = useBooking();
  const navigate = useNavigate();

  if (!draft.hotelSlug || !draft.checkIn || !draft.checkOut) {
    return <Navigate to="/booking" replace />;
  }

  const hotel = hotels.find((entry) => entry.slug === draft.hotelSlug);
  const rooms = products.filter((product) => (
    product.hotelId === hotel?.id
    && product.category === 'Rooms'
    && product.capacity >= (draft.guestCount || 1)
  ));

  function selectRoom(room) {
    updateDraft({ roomId: room.id });
    navigate('/booking/extras');
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
      </header>
      <BookingSteps current={2} />
      <div className={styles.content}>
        <p className={styles.eyebrow}>{hotel?.shortName}</p>
        <h1>Choose your room.</h1>
        {rooms.length === 0 ? (
          <p>No rooms match {draft.guestCount} guests for these dates. <Link to="/booking">Adjust your search</Link>.</p>
        ) : (
          <div className={styles.rooms}>
            {rooms.map((room) => (
              <article key={room.id} className={styles.room}>
                <img className={styles.roomImage} src={`/${room.images[0]}`} alt={room.title}  loading="lazy" />
                <div>
                  <h3>{room.title}</h3>
                  <p className={styles.roomMeta}>{room.size} m² · Up to {room.capacity} guests</p>
                  <p className={styles.roomAmenities}>{room.amenities.slice(0, 3).join(' · ')}</p>
                </div>
                <div className={styles.roomPrice}>
                  <strong>${room.price.toFixed(0)}</strong>
                  <span>per night</span>
                  <button type="button" className={styles.roomSelect} onClick={() => selectRoom(room)}>Select</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}