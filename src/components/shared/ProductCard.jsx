import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, hotelSlug }) {
  return (
    <Link to={`/hotels/${hotelSlug}/product/${product.slug}`} className={styles.card}>
      <div className={styles.image}>
        <span className={styles.styleTag}>{product.style}</span>
      </div>

      <div className={styles.panel}>
        <h3 className={styles.title}>{product.title}</h3>
        <div className={styles.meta}>
          {product.size && <span>{product.size} m²</span>}
          {product.size && <span className={styles.dot}>•</span>}
          <span>{product.style}</span>
        </div>
        <div className={styles.footer}>
          <div className={styles.price}>
            From {formatPrice(product.price, product.currency)}
            <span> / night</span>
          </div>
          <span className={styles.plus} aria-hidden="true">+</span>
        </div>
      </div>
    </Link>
  );
}