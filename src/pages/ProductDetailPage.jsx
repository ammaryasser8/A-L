import { useParams, Link } from 'react-router-dom';
import products from '../data/products.json';
import { useHotelBySlug } from '../hooks/useHotelBySlug';
import { formatPrice } from '../utils/formatPrice';
import StarRating from '../components/shared/StarRating';
import Button from '../components/shared/Button';
import ReviewList from '../components/shared/ReviewList';
import NotFoundPage from './NotFoundPage';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { hotelSlug, productSlug } = useParams();
  const hotel = useHotelBySlug(hotelSlug);
  const product = products.find(
    (p) => p.slug === productSlug && p.hotelId === hotel?.id
  );

  if (!hotel || !product) {
    return <NotFoundPage />;
  }

  const themeVars = {
    '--theme-primary': hotel.theme.colors.primary,
    '--theme-primary-dark': hotel.theme.colors.primaryDark,
    '--theme-accent': hotel.theme.colors.accent,
    '--theme-accent-light': hotel.theme.colors.accentLight,
    '--theme-surface': hotel.theme.colors.surface,
    '--theme-surface-dark': hotel.theme.colors.surfaceDark,
    '--theme-on-primary': hotel.theme.colors.onPrimary,
    '--theme-ink': hotel.theme.colors.ink,
    '--theme-muted': '#6b7570',
    '--font-heading': hotel.theme.fonts.heading,
    '--font-body': hotel.theme.fonts.body,
    fontFamily: hotel.theme.fonts.body,
    background: hotel.theme.colors.surface,
    minHeight: '100vh',
  };

  return (
    <div style={themeVars}>
      <div className={`wrap ${styles.wrap}`}>
        <Link to={`/hotels/${hotel.slug}`} className={styles.back}>
          ← Back to {hotel.name}
        </Link>

        <div className={styles.image} />

        <div className={styles.header}>
          <div className={styles.category}>
            {product.category} · {product.style}
          </div>
          <h1 className={styles.title}>{product.title}</h1>
          <StarRating rating={product.rating} reviewsCount={product.reviewsCount} />
        </div>

        <div className={styles.meta}>
          {product.capacity && <span>{product.capacity} guests</span>}
          {product.size && <span>{product.size} m²</span>}
        </div>

        <p className={styles.description}>{product.description}</p>

        <div className={styles.amenities}>
          {product.amenities.map((a) => (
            <span key={a} className={styles.pill}>
              {a}
            </span>
          ))}
        </div>

        <div className={styles.priceRow}>
          <div className={styles.price}>
            {formatPrice(product.price, product.currency)}
            <span> / night</span>
          </div>
          <Button variant="primary">Reserve now</Button>
        </div>

        <h2 className={styles.reviewsHeading}>Guest reviews</h2>
        <ReviewList reviews={product.reviews} />
      </div>
    </div>
  );
}