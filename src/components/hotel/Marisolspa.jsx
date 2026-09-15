import { useHotelProducts } from '../../hooks/useHotelProducts';
import { useReveal } from '../../hooks/useReveal';
import { Link } from 'react-router-dom';
import styles from './MarisolSpa.module.css';

export default function MarisolSpa({ hotel }) {
  const spaProducts = useHotelProducts(hotel?.id, 'Spa & Wellness');
  const [ref, visible] = useReveal();

  if (spaProducts.length === 0) return null;

  const [featured, ...rest] = spaProducts;
  const featuredCover = featured.images?.[0];

  return (
    <section id="spa" className={styles.section}>
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
        <Link className={styles.featuredLink} to={`/hotels/${hotel.slug}/product/${featured.slug}`} aria-label={`Discover ${featured.title}`} />
      </div>

      {rest.length > 0 && (
        <div className={styles.row}>
          {rest.slice(0, 4).map((p) => {
            const cover = p.images?.[0];
            return (
              <Link key={p.id} className={styles.item} to={`/hotels/${hotel.slug}/product/${p.slug}`}>
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
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
