import { useSectionLink } from '../../hooks/useSectionLink';
import { useMagnetic } from '../../hooks/useMagnetic';
import styles from './MarisolFinalCTA.module.css';

const CTA_IMAGE = '/images/sections/marisol-final-cta.jpg';

export default function MarisolFinalCTA() {
  const goTo = useSectionLink('/hotels/marisol-bay-resort');
  const magneticPrimary = useMagnetic(16);
  const magneticSecondary = useMagnetic(16);

  return (
    <section className={styles.section}>
      <div className={styles.marbleBg} />
      <div className={styles.photoLayer} style={{ backgroundImage: `url(${CTA_IMAGE})` }} />
      <div className={styles.scrim} />

      <div className={styles.content}>
        <h2>
          Your Next Escape
          <br />
          Starts Here.
        </h2>
        <div className={styles.actions}>
          <button ref={magneticPrimary} className={styles.primary} onClick={() => goTo('booking')}>
            Book Your Stay
          </button>
          <button
            ref={magneticSecondary}
            className={styles.secondary}
            onClick={() => goTo('rooms')}
          >
            Explore Marisol Bay
          </button>
        </div>
      </div>
    </section>
  );
}