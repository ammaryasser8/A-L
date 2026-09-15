import { useEffect, useMemo, useState } from 'react';
import styles from './MarisolTestimonials.module.css';

function starsString(rating) {
  const full = Math.round(rating);
  return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full);
}

export default function MarisolTestimonials({ products }) {
  const [active, setActive] = useState(0);

  const testimonials = useMemo(() => {
    const seenCategory = new Set();
    const picked = [];
    [...products]
      .sort((a, b) => b.rating - a.rating)
      .forEach((p) => {
        if (seenCategory.has(p.category)) return;
        const review = p.reviews.find((r) => r.rating === 5) || p.reviews[0];
        picked.push({ ...review, category: p.category, rating: review.rating });
        seenCategory.add(p.category);
      });
    return picked.slice(0, 5);
  }, [products]);

  useEffect(() => {
    if (testimonials.length < 2) return undefined;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;
  const t = testimonials[active];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <span className={styles.eyebrow}>Guest Testimonials</span>

        <div key={active} className={styles.quoteBlock}>
          <p className={styles.quote}>&ldquo;{t.comment}&rdquo;</p>
          <div className={styles.meta}>
            <span className={styles.author}>{t.author}</span>
            <span className={styles.stars}>{starsString(t.rating)}</span>
          </div>
        </div>

        {testimonials.length > 1 && (
          <div className={styles.dots}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={i === active ? `${styles.dot} ${styles.dotActive}` : styles.dot}
                onClick={() => setActive(i)}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}