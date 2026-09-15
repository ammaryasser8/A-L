import { useReveal } from '../../hooks/useReveal';
import styles from './MarisolIntro.module.css';

const INTRO_IMAGE = '/images/hero/marisol-intro-architecture.jpg';

export default function MarisolIntro({ hotel }) {
  const [textRef, textVisible] = useReveal();
  const [imageRef, imageVisible] = useReveal();

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div
          ref={textRef}
          className={textVisible ? `${styles.text} ${styles.textVisible}` : styles.text}
        >
          <span className={styles.location}>
            {hotel?.address?.area}, {hotel?.address?.city}
          </span>
          <h2>
            A Quiet Place
            <br />
            Between Sea and Sky
          </h2>
          <span className={styles.rule} />
          <p>{hotel?.description}</p>
        </div>

        <div
          ref={imageRef}
          className={imageVisible ? `${styles.imageWrap} ${styles.imageVisible}` : styles.imageWrap}
        >
          <div className={styles.marbleBg} />
          <div className={styles.photoLayer} style={{ backgroundImage: `url(${INTRO_IMAGE})` }} />
        </div>
      </div>
    </section>
  );
}