import { useHotelProducts } from '../../hooks/useHotelProducts';
import { useReveal } from '../../hooks/useReveal';
import { Link } from 'react-router-dom';
import styles from './MarisolDining.module.css';

function DiningRow({ product, reverse, hotelSlug }) {
  const [ref, visible] = useReveal();
  const cover = product.images?.[0];

  return (
    <div
      ref={ref}
      className={[
        styles.row,
        reverse ? styles.reverse : '',
        visible ? styles.visible : '',
      ].join(' ')}
    >
      <div className={styles.imageWrap}>
        <div className={styles.marbleBg} />
        {cover && (
          <div className={styles.photoLayer} style={{ backgroundImage: `url(/${cover})` }} />
        )}
      </div>
      <div className={styles.text}>
        <span className={styles.eyebrow}>{product.style}</span>
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <Link className={styles.link} to={`/hotels/${hotelSlug}/product/${product.slug}`}>Explore dining →</Link>
      </div>
    </div>
  );
}

export default function MarisolDining({ hotel }) {
  const restaurants = useHotelProducts(hotel?.id, 'Restaurants').slice(0, 3);

  if (restaurants.length === 0) return null;

  return (
    <section id="dining" className={styles.section}>
      <div className={styles.head}>
        <span className={styles.headEyebrow}>Dining</span>
        <h2>A Table by the Sea</h2>
        <Link className={styles.link} to={`/hotels/${hotel.slug}/collection/dining`}>View every table →</Link>
      </div>

      <div className={styles.rows}>
        {restaurants.map((r, i) => (
          <DiningRow key={r.id} product={r} reverse={i % 2 === 1} hotelSlug={hotel.slug} />
        ))}
      </div>
    </section>
  );
}
