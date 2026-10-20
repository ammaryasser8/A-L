import { Link } from 'react-router-dom';
import hotels from '../../data/hotels.json';
import styles from './GroupExperience.module.css';

const Arrow = () => <span aria-hidden="true" className={styles.arrow}>↗</span>;
const imagePath = (image) => `/${image}`;

export default function StaysSection({ stays, selectedStay, setSelectedStay }) {
  return (
    <section id="stays" className={styles.stays}>
      <div className={styles.stayHead}><div className={styles.sectionLabel}><span>04</span><i />The art of staying</div><h2 data-reveal>Rooms with a<br /><em>sense of place.</em></h2></div>
      <div className={styles.staySwitch} role="tablist" aria-label="Choose a destination">
        {stays.map((stay, index) => {
          const hotel = hotels.find((item) => item.id === stay.hotelId);
          return <button key={stay.id} type="button" role="tab" aria-selected={selectedStay === index} onClick={() => setSelectedStay(index)}>{String(index + 1).padStart(2, '0')} / {hotel.shortName}</button>;
        })}
      </div>
      <div className={styles.stayGrid}>
        {stays.map((stay, index) => {
          const hotel = hotels.find((item) => item.id === stay.hotelId);
          return (
            <Link key={stay.id} to={`/hotels/${hotel.slug}/product/${stay.slug}`} className={`${styles.stayCard} ${selectedStay === index ? styles.stayActive : ''}`}>
              <div className={styles.stayImage} style={{ backgroundImage: `url(${imagePath(stay.images[0])})` }} />
              <div><p>{hotel.shortName} / {stay.category}</p><h3>{stay.title}</h3><span>{stay.size} m² · Up to {stay.capacity} guests <Arrow /></span></div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}