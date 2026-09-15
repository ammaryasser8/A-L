import { useSectionLink } from '../../hooks/useSectionLink';
import styles from './MarisolLocation.module.css';

const LOCATION_IMAGE = '/images/sections/marisol-location-map.jpg';

export default function MarisolLocation({ hotel }) {
  const goTo = useSectionLink('/hotels/marisol-bay-resort');

  if (!hotel?.address) return null;

  return (
    <section id="location" className={styles.section}>
      <div className={styles.imageWrap}>
        <div className={styles.marbleBg} />
        <div className={styles.photoLayer} style={{ backgroundImage: `url(${LOCATION_IMAGE})` }} />
      </div>

      <div className={styles.content}>
        <span className={styles.eyebrow}>The final coordinate</span>
        <h2>
          Found at the edge
          <br />
          of the <em>Red Sea.</em>
        </h2>
        <p>Not somewhere to rush through. A shoreline to arrive at, breathe into, and carry with you long after check-out.</p>

        <ul className={styles.facts}>
          <li>
            <strong>Resort address</strong>
            <span>
              {hotel.address.street}, {hotel.address.area}, {hotel.address.city}
            </span>
          </li>
          <li>
            <strong>Nearest airport</strong>
            <span>Hurghada International Airport</span>
          </li>
          <li>
            <strong>Arrival route</strong>
            <span>A short drive along the Red Sea coast from Hurghada</span>
          </li>
        </ul>

        <button type="button" className={styles.cta} onClick={() => goTo('rooms')}>
          Begin your Marisol stay <span>↗</span>
        </button>
      </div>
    </section>
  );
}
