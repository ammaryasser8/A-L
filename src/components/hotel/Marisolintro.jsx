import { useReveal } from '../../hooks/useReveal';
import styles from './MarisolIntro.module.css';

const INTRO_IMAGE = '/images/hero/marisol-intro-architecture.jpg';

export default function MarisolIntro({ hotel }) {
  const [sectionRef, visible] = useReveal();

  return (
    <section ref={sectionRef} className={`${styles.section} ${visible ? styles.visible : ''}`}>
      <div className={styles.topline}><span>01 / Arrival</span><i /><span>The Red Sea, Egypt</span></div>
      <div className={styles.grid}>
        <div className={styles.statement}>
          <span className={styles.eyebrow}>A different kind of coastline</span>
          <h2>Made for the <em>long way</em> around.</h2>
          <p>{hotel?.description}</p>
          <div className={styles.moments}><span>Quiet mornings</span><span>Salt air</span><span>Open water</span></div>
        </div>
        <div className={styles.art}>
          <div className={styles.photo} style={{ backgroundImage: `url(${INTRO_IMAGE})` }} />
          <div className={styles.stamp}><span>MARISOL</span><b>∞</b><span>EST. 2021</span></div>
          <div className={styles.note}>No itinerary<br />required.</div>
        </div>
      </div>
    </section>
  );
}
