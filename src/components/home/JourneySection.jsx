import { Link } from 'react-router-dom';
import styles from './GroupExperience.module.css';

const Arrow = () => <span aria-hidden="true" className={styles.arrow}>↗</span>;

export default function JourneySection({ destinations }) {
  return (
    <section id="journey" className={styles.journey}>
      <div className={styles.journeyGlow} />
      <p className={styles.eyebrow}>The next chapter</p>
      <h2>Choose a world.<br /><em>Make it yours.</em></h2>
      <div>
        {destinations.map((destination) => (
          <Link data-cursor="Enter" key={destination.id} to={`/hotels/${destination.hotel.slug}`}>
            <small>{destination.number} / {destination.hotel.address.city}</small>
            <strong>{destination.hotel.name}</strong>
            <Arrow />
          </Link>
        ))}
      </div>
    </section>
  );
}