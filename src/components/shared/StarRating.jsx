import { starsString } from '../../utils/stars';
import styles from './StarRating.module.css';

export default function StarRating({ rating, reviewsCount }) {
  return (
    <span className={styles.wrap}>
      <span className={styles.stars}>{starsString(rating)}</span>
      <span className={styles.count}>
        {rating.toFixed(1)}
        {typeof reviewsCount === 'number' ? ` (${reviewsCount})` : ''}
      </span>
    </span>
  );
}