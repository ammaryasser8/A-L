import { useReveal } from '../../hooks/useReveal';
import styles from './MarisolStory.module.css';

const MAIN_IMAGE = '/images/sections/marisol-story-main.jpg';
const DETAIL_IMAGE = '/images/sections/marisol-story-detail.jpg';

export default function MarisolStory({ hotel }) {
  const [mainRef, mainVisible] = useReveal();
  const [detailRef, detailVisible] = useReveal();
  const [textRef, textVisible] = useReveal();

  return (
    <section id="story" className={styles.section}>
      <div className={styles.grid}>
        <div
          ref={mainRef}
          className={mainVisible ? `${styles.mainImage} ${styles.visible}` : styles.mainImage}
        >
          <div className={styles.marbleBg} />
          <div className={styles.photoLayer} style={{ backgroundImage: `url(${MAIN_IMAGE})` }} />
        </div>

        <div className={styles.side}>
          <div
            ref={detailRef}
            className={
              detailVisible ? `${styles.detailImage} ${styles.visible}` : styles.detailImage
            }
          >
            <div className={styles.marbleBg} />
            <div
              className={styles.photoLayer}
              style={{ backgroundImage: `url(${DETAIL_IMAGE})` }}
            />
          </div>

          <div
            ref={textRef}
            className={textVisible ? `${styles.text} ${styles.visible}` : styles.text}
          >
            <span className={styles.eyebrow}>Our Story</span>
            <h2>
              Built Around
              <br />
              the Rhythm of the Sea
            </h2>
            <p>{hotel?.description}</p>
            <span className={styles.location}>
              {hotel?.address?.area}, {hotel?.address?.city}, {hotel?.address?.country}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}