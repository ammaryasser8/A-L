import { useEffect, useState } from 'react';
import { useWheelHorizontalScroll } from '../../hooks/Usewheelhorizontalscroll';
import ProductCard from '../shared/ProductCard';
import styles from './RoomsCarousel.module.css';

const GAP = 24;

export default function RoomsCarousel({ products, hotelSlug }) {
  const trackRef = useWheelHorizontalScroll();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;

    function stepWidth() {
      const firstCard = el.firstElementChild;
      return firstCard ? firstCard.getBoundingClientRect().width + GAP : 1;
    }

    function onScroll() {
      const i = Math.round(el.scrollLeft / stepWidth());
      setIndex(Math.min(Math.max(i, 0), products.length - 1));
    }

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [trackRef, products.length]);

  function goTo(delta) {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild;
    const step = firstCard ? firstCard.getBoundingClientRect().width + GAP : 340;
    el.scrollBy({ left: delta * step, behavior: 'smooth' });
  }

  if (products.length === 0) {
    return <p className={styles.empty}>No rooms available for these dates. Try different dates.</p>;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <span className={styles.progress}>
          {String(index + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
        </span>
        <div className={styles.arrows}>
          <button
            type="button"
            aria-label="Previous room"
            onClick={() => goTo(-1)}
            disabled={index === 0}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next room"
            onClick={() => goTo(1)}
            disabled={index === products.length - 1}
          >
            →
          </button>
        </div>
      </div>

      <div ref={trackRef} className={styles.track}>
        {products.map((product) => (
          <div key={product.id} className={styles.card}>
            <ProductCard product={product} hotelSlug={hotelSlug} />
          </div>
        ))}
      </div>
    </div>
  );
}
