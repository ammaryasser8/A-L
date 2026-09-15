import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import styles from './ProductCard.module.css';

export default function ProductCard({
  product,
  hotelSlug,
  theme = 'aurelia',
}) {
  const cardClass =
    theme === 'aurelia'
      ? `${styles.card} ${styles.aurelia}`
      : `${styles.card} ${styles.marisol}`;

  return (
    <Link
      to={`/hotels/${hotelSlug}/product/${product.slug}`}
      className={cardClass}
      aria-label={`Explore ${product.title}`}
    >
      <div className={styles.image}>
        <img
          src={`/${product.images?.[0]}`}
          alt={product.title}
          className={styles.imageContent}
        />

        <div className={styles.imageOverlay} />

        <div className={styles.imageGlow} />

        <span className={styles.styleTag}>
          {product.style}
        </span>

        <div className={styles.viewLabel}>
          <span>Discover</span>
          <ArrowUpRight size={14} strokeWidth={1.5} />
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.headingRow}>
          <h3 className={styles.title}>
            {product.title}
          </h3>

          <div className={styles.cornerArrow}>
            <ArrowUpRight
              size={17}
              strokeWidth={1.4}
            />
          </div>
        </div>

        <div className={styles.meta}>
          {product.size && (
            <span>{product.size} m²</span>
          )}

          {product.size && (
            <span className={styles.dot}>•</span>
          )}

          <span>{product.style}</span>
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.priceLabel}>
              From
            </span>

            <strong>
              {formatPrice(
                product.price,
                product.currency
              )}
            </strong>

            <span className={styles.night}>
              / night
            </span>
          </div>

          <span className={styles.explore}>
            Explore
          </span>
        </div>
      </div>
    </Link>
  );
}