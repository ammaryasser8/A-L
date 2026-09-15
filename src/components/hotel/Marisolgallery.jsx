import { useEffect, useMemo, useState } from 'react';
import { useHotelProducts } from '../../hooks/useHotelProducts';
import styles from './MarisolGallery.module.css';

// Cycles large/medium/small so the grid never feels like a uniform grid.
const SIZE_PATTERN = ['large', 'small', 'medium', 'small', 'small', 'medium', 'large', 'small'];

export default function MarisolGallery({ hotel }) {
  const allProducts = useHotelProducts(hotel?.id);
  const [activeIndex, setActiveIndex] = useState(null);

  const images = useMemo(() => {
    const seenCategory = {};
    const picked = [];
    allProducts.forEach((p) => {
      seenCategory[p.category] = seenCategory[p.category] || 0;
      if (seenCategory[p.category] >= 2) return; // at most 2 per category, keeps it varied
      const cover = p.images?.[0];
      if (cover) picked.push({ src: `/${cover}`, caption: p.title });
      seenCategory[p.category] += 1;
    });
    return picked.slice(0, 10);
  }, [allProducts]);

  useEffect(() => {
    if (activeIndex === null) return undefined;

    function onKeyDown(e) {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + images.length) % images.length);
    }

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeIndex, images.length]);

  if (images.length === 0) return null;

  return (
    <section id="gallery" className={styles.section}>
      <div className={styles.head}>
        <span className={styles.eyebrow}>Gallery</span>
        <h2>Moments at Marisol Bay</h2>
      </div>

      <div className={styles.grid}>
        {images.map((img, i) => (
          <button
            key={img.src + i}
            type="button"
            className={`${styles.item} ${styles[SIZE_PATTERN[i % SIZE_PATTERN.length]]}`}
            data-cursor="View"
            onClick={() => setActiveIndex(i)}
          >
            <img src={img.src} alt={img.caption} loading="lazy" decoding="async" />
            <span className={styles.viewLabel}>View</span>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div className={styles.lightbox} onClick={() => setActiveIndex(null)}>
          <button className={styles.closeBtn} aria-label="Close gallery">
            ✕
          </button>
          <button
            className={`${styles.navBtn} ${styles.navPrev}`}
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((i) => (i - 1 + images.length) % images.length);
            }}
          >
            ←
          </button>

          <img
            className={styles.lightboxImage}
            src={images[activeIndex].src}
            alt={images[activeIndex].caption}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className={`${styles.navBtn} ${styles.navNext}`}
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((i) => (i + 1) % images.length);
            }}
          >
            →
          </button>

          <div className={styles.counter}>
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
}