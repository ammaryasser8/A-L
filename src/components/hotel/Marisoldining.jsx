import { useHotelProducts } from '../../hooks/useHotelProducts';
import { useReveal } from '../../hooks/useReveal';
import styles from './MarisolDining.module.css';

function DiningRow({ product, reverse }) {
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
        <span className={styles.link}>Explore Dining →</span>
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
      </div>

      <div className={styles.rows}>
        {restaurants.map((r, i) => (
          <DiningRow key={r.id} product={r} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}