import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Heart } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { useAuth } from '../../hooks/useAuth';
import { favoritesService } from '../../services/favoritesService';
import styles from './ProductCard.module.css';

export default function ProductCard({
  product,
  hotelSlug,
  theme = 'aurelia',
}) {
  const { isAuthenticated, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [favoriteError, setFavoriteError] = useState('');
  const cardClass =
    theme === 'aurelia'
      ? `${styles.card} ${styles.aurelia}`
      : `${styles.card} ${styles.marisol}`;

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    let active = true;
    favoritesService.isFavorite(session.id, product.id)
      .then((value) => { if (active) setIsFavorite(value); })
      .catch(() => { if (active) setFavoriteError(''); });
    return () => { active = false; };
  }, [isAuthenticated, product.id, session?.id]);

  const displayedFavorite = isAuthenticated && isFavorite;

  async function toggleFavorite(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (isSaving) return;
    setIsSaving(true);
    setFavoriteError('');
    try {
      const next = await favoritesService.toggleFavorite(session.id, product.id, displayedFavorite);
      setIsFavorite(next);
    } catch (error) {
      setFavoriteError(error.message || 'We could not update your collection.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <article className={cardClass}>
      <Link to={`/hotels/${hotelSlug}/product/${product.slug}`} className={styles.cardLink} aria-label={`Explore ${product.title}`}>
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
      <button
        type="button"
        className={`${styles.favorite} ${displayedFavorite ? styles.favoriteActive : ''}`}
        onClick={toggleFavorite}
        disabled={isSaving}
        aria-label={displayedFavorite ? `Remove ${product.title} from your collection` : `Save ${product.title} to your collection`}
        aria-pressed={displayedFavorite}
      ><Heart size={16} strokeWidth={1.5} fill={displayedFavorite ? 'currentColor' : 'none'} /></button>
      {favoriteError && <span className={styles.favoriteError} role="status">{favoriteError}</span>}
    </article>
  );
}
