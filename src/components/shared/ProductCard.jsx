import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import { formatPrice } from '../../utils/formatPrice';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, hotelSlug }) {
  return (
    <Link to={`/hotels/${hotelSlug}/product/${product.slug}`} className={styles.card}>
      <div className={styles.image}>
        <span className={styles.styleTag}>{product.style}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.category}>{product.category}</div>
        <h3 className={styles.title}>{product.title}</h3>
        <StarRating rating={product.rating} reviewsCount={product.reviewsCount} />
        <div className={styles.footer}>
          <div className={styles.price}>
            {formatPrice(product.price, product.currency)}
            <span> / night</span>
          </div>
          <span className={styles.link}>View details →</span>
        </div>
      </div>
    </Link>
  );
}