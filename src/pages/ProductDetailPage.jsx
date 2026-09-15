import { useLayoutEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import products from '../data/products.json';
import { useHotelBySlug } from '../hooks/useHotelBySlug';
import { formatPrice } from '../utils/formatPrice';
import StarRating from '../components/shared/StarRating';
import Button from '../components/shared/Button';
import ReviewList from '../components/shared/ReviewList';
import NotFoundPage from './NotFoundPage';
import SiteFooter from '../components/layout/SiteFooter';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { hotelSlug, productSlug } = useParams();
  const hotel = useHotelBySlug(hotelSlug);
  const product = products.find(
    (p) => p.slug === productSlug && p.hotelId === hotel?.id
  );
  const [reserved, setReserved] = useState(false);

  useLayoutEffect(() => {
    const resetScroll = () => {
      window.__alLenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    const frameId = requestAnimationFrame(resetScroll);
    return () => cancelAnimationFrame(frameId);
  }, [hotelSlug, productSlug]);

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
    '--theme-muted': '#83766A',
    '--font-heading': hotel.theme.fonts.heading,
    '--font-body': hotel.theme.fonts.body,
    fontFamily: hotel.theme.fonts.body,
    background: hotel.theme.colors.surface,
    minHeight: '100vh',
  };

  const heroImage = product.images?.[0];
  const gallery = product.images?.slice(1) || [];

  return (
    <div style={themeVars}>
      {/* ---- premium full-bleed banner ---- */}
      <div className={styles.banner}>
        <div className={styles.marbleBg} />
        {heroImage && (
          <div className={styles.photoLayer} style={{ backgroundImage: `url(/${heroImage})` }} />
        )}
        <div className={styles.bannerScrim} />

        <div className={`wrap ${styles.bannerContent}`}>
          <div className={styles.breadcrumbs}>
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to={`/hotels/${hotel.slug}`}>{hotel.name}</Link>
            <span>/</span>
            <span>{product.category}</span>
          </div>
          <div className={styles.bannerCategory}>
            {product.category} · {product.style}
          </div>
          <h1 className={styles.bannerTitle}>{product.title}</h1>
          <StarRating rating={product.rating} reviewsCount={product.reviewsCount} />
        </div>
      </div>

      {/* ---- content ---- */}
      <div className={`wrap ${styles.layout}`}>
        <div className={styles.main}>
          <p className={styles.description}>{product.description}</p>

          <div className={styles.amenities}>
            {product.amenities.map((a) => (
              <span key={a} className={styles.pill}>
                {a}
              </span>
            ))}
          </div>

          {gallery.length > 0 && (
            <>
              <h2 className={styles.sectionHeading}>Gallery</h2>
              <div className={styles.gallery}>
                {gallery.map((img, i) => (
                  <div key={i} className={styles.galleryItem}>
                    <div className={styles.marbleBg} />
                    <div
                      className={styles.photoLayer}
                      style={{ backgroundImage: `url(/${img})` }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          <h2 className={styles.sectionHeading}>Guest reviews</h2>
          <ReviewList reviews={product.reviews} />
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.price}>
              {formatPrice(product.price, product.currency)}
              <span> / night</span>
            </div>

            <div className={styles.sidebarMeta}>
              {product.capacity && <span>{product.capacity} guests</span>}
              {product.size && <span>{product.size} m²</span>}
            </div>

            {reserved ? (
              <p className={styles.reservedNote}>
                ✓ Request received — our team will confirm by email shortly.
              </p>
            ) : (
              <Button
                variant="primary"
                className={styles.reserveBtn}
                onClick={() => setReserved(true)}
              >
                Reserve now
              </Button>
            )}

            <p className={styles.trustLine}>Free cancellation up to 48 hours before check-in.</p>

            <div className={styles.sidebarDivider} />

            <div className={styles.sidebarContact}>
              <span>Need help booking?</span>
              <a href={`tel:${hotel.contact?.phone}`}>{hotel.contact?.phone}</a>
            </div>
          </div>
        </aside>
      </div>

      <SiteFooter hotel={hotel} />
    </div>
  );
}
