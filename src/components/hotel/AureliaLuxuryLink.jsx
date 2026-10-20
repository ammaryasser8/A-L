import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import styles from '../../pages/AureliaHotelPage.module.css';

export default function LuxuryLink({
  to,
  children,
  light = false,
}) {
  return (
    <Link
      to={to}
      className={`${styles.luxuryLink} ${
        light ? styles.luxuryLinkLight : ''
      }`}
    >
      <span className={styles.luxuryLinkText}>
        {children}
      </span>

      <span className={styles.luxuryLinkIcon}>
        <ArrowUpRight
          size={17}
          strokeWidth={1.25}
        />
      </span>

      <span className={styles.luxuryLinkLine} />
    </Link>
  );
}