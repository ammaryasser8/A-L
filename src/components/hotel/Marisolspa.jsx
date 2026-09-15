import { useHotelProducts } from '../../hooks/useHotelProducts';
import { useReveal } from '../../hooks/useReveal';
import styles from './MarisolSpa.module.css';

export default function MarisolSpa({ hotel }) {
  const spaProducts = useHotelProducts(hotel?.id, 'Spa & Wellness');
  const [ref, visible] = useReveal();

  if (spaProducts.length === 0) return null;

  const [featured, ...rest] = spaProducts;
  const featuredCover = featured.images?.[0];

  return (
    <section className={styles.section}>
      <div
        ref={ref}
        className={visible ? `${styles.featured} ${styles.visible}` : styles.featured}
      >
        <div className={styles.marbleBg} />
        {featuredCover && (
          <div
            className={styles.photoLayer}
            style={{ backgroundImage: `url(/${featuredCover})` }}
          />
        )}
        <div className={styles.scrim} />
        <div className={styles.featuredContent}>
          <span className={styles.eyebrow}>Wellness Journey</span>
          <h2>{featured.title}</h2>
          <p>{featured.description}</p>
        </div>
      </div>

      {rest.length > 0 && (
        <div className={styles.row}>
          {rest.slice(0, 4).map((p) => {
            const cover = p.images?.[0];
            return (
              <div key={p.id} className={styles.item}>
                <div className={styles.itemImage}>
                  <div className={styles.marbleBg} />
                  {cover && (
                    <div
                      className={styles.photoLayer}
                      style={{ backgroundImage: `url(/${cover})` }}
                    />
                  )}
                </div>
                <span>{p.title}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}