import { useSectionLink } from '../../hooks/useSectionLink';
import styles from './MarisolLocation.module.css';

const LOCATION_IMAGE = '/images/sections/marisol-location-map.jpg';

export default function MarisolLocation({ hotel }) {
  const goTo = useSectionLink('/hotels/marisol-bay-resort');

  if (!hotel?.address) return null;

  return (
    <section className={styles.section}>
      <div className={styles.imageWrap}>
        <div className={styles.marbleBg} />
        <div className={styles.photoLayer} style={{ backgroundImage: `url(${LOCATION_IMAGE})` }} />
      </div>

      <div className={styles.content}>
        <span className={styles.eyebrow}>Location</span>
        <h2>
          {hotel.shortName}
          <br />
          {hotel.address.area}, {hotel.address.country}
        </h2>
        <p>{hotel.description}</p>

        <ul className={styles.facts}>
          <li>
            <strong>Address</strong>
            <span>
              {hotel.address.street}, {hotel.address.area}, {hotel.address.city}
            </span>
          </li>
          <li>
            <strong>Nearest Airport</strong>
            <span>Hurghada International Airport</span>
          </li>
          <li>
            <strong>Getting Here</strong>
            <span>A short drive along the Red Sea coast from Hurghada</span>
          </li>
        </ul>

        <button type="button" className={styles.cta} onClick={() => goTo('rooms')}>
          Discover {hotel.address.city} →
        </button>
      </div>
    </section>
  );
}