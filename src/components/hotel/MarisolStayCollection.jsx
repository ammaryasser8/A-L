import { Link } from 'react-router-dom';
import { ArrowUpRight, Users } from 'lucide-react';
import { useHotelProducts } from '../../hooks/useHotelProducts';
import styles from './MarisolStayCollection.module.css';

export default function MarisolStayCollection({ hotel }) {
  const rooms = useHotelProducts(hotel?.id, 'Rooms').slice(0, 3);
  const suites = useHotelProducts(hotel?.id, 'Suites').slice(0, 3);
  const stays = [...rooms, ...suites];

  if (!stays.length) return null;

  return (
    <section id="rooms" className={styles.section}>
      <div className={styles.intro}>
        <span>Accommodation / 01</span>
        <h2>Stay at the<br /><em>water&apos;s edge.</em></h2>
        <p>Six distinct ways to wake up to the Red Sea—each with its own mood, view and rhythm.</p>
        <a href="#dining" className={styles.next}>Continue to dining <ArrowUpRight size={15} /></a>
      </div>

      <div className={styles.collection}>
        {stays.map((stay, index) => (
          <Link
            key={stay.id}
            to={`/hotels/${hotel.slug}/product/${stay.slug}`}
            className={`${styles.card} ${index === 0 ? styles.featured : ''}`}
          >
            <img src={`/${stay.images[0]}`} alt={stay.title} loading={index > 1 ? 'lazy' : 'eager'} />
            <div className={styles.shade} />
            <div className={styles.cardTop}><span>{String(index + 1).padStart(2, '0')}</span><span>{stay.category}</span></div>
            <div className={styles.cardBottom}>
              <h3>{stay.title}</h3>
              <p><Users size={14} /> Up to {stay.capacity} guests <i /> {stay.size} m²</p>
              <span className={styles.discover}>Discover <ArrowUpRight size={16} /></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
