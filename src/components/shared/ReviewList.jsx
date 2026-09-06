import { starsString } from '../../utils/stars';
import styles from './ReviewList.module.css';

export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <div className={styles.list}>
      {reviews.map((r, i) => (
        <div key={i} className={styles.item}>
          <div className={styles.top}>
            <span className={styles.author}>{r.author}</span>
            <span className={styles.date}>{r.date}</span>
          </div>
          <div className={styles.stars}>{starsString(r.rating)}</div>
          <p className={styles.comment}>{r.comment}</p>
        </div>
      ))}
    </div>
  );
}