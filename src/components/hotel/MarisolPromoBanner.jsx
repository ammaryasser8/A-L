import Button from '../shared/Button';
import styles from './MarisolPromoBanner.module.css';

const BANNER_MEDIA = '/images/sections/marisol-promo-banner.jpg';

export default function MarisolPromoBanner() {
  return (
    <section id="offers" className={styles.banner}>
      <div className={styles.marbleBg} />
      <div className={styles.photoLayer} style={{ backgroundImage: `url(${BANNER_MEDIA})` }} />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <span className={styles.eyebrow}>Special offer</span>
        <h2>
          Stay longer,
          <br />
          save more.
        </h2>
        <p>Enjoy up to 20% off when you stay 3 nights or more.</p>
        <Button
          variant="primary"
          onClick={() =>
            document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        >
          View offers
        </Button>
      </div>
    </section>
  );
}