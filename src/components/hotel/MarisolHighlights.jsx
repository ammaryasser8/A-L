import styles from './MarisolHighlights.module.css';

const HIGHLIGHTS = [
  {
    title: 'Minimalist Design',
    text: 'Timeless spaces with elegant simplicity.',
    media: '/images/sections/marisol-highlight-design.jpg',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="3" y="7" width="18" height="11" rx="1.5" />
        <path d="M3 7l3-3h12l3 3" />
      </svg>
    ),
  },
  {
    title: 'Infinity Views',
    text: 'Breathtaking ocean and skyline views.',
    media: '/images/sections/marisol-highlight-views.jpg',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="12" cy="12" r="3.2" />
        <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
      </svg>
    ),
  },
  {
    title: 'Exquisite Dining',
    text: 'A culinary journey like no other.',
    media: '/images/sections/marisol-highlight-dining.jpg',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M17 3c-2 0-2 4-2 6s0 3 2 3 2-1 2-3-0-6-2-6Zm0 9v9" />
      </svg>
    ),
  },
  {
    title: 'Holistic Spa',
    text: 'Rejuvenate your body, mind, and soul.',
    media: '/images/sections/marisol-highlight-spa.jpg',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M12 3c2 3 2 5 0 7-2-2-2-4 0-7Z" />
        <path d="M6 12c2 2 2 5 0 7M18 12c-2 2-2 5 0 7M12 10v11" />
      </svg>
    ),
  },
];

export default function MarisolHighlights() {
  return (
    <section className={styles.grid}>
      {HIGHLIGHTS.map((h) => (
        <div key={h.title} className={styles.card}>
          <div className={styles.image}>
            <div className={styles.marbleBg} />
            <div className={styles.photoLayer} style={{ backgroundImage: `url(${h.media})` }} />
            <span className={styles.icon}>{h.icon}</span>
          </div>
          <div className={styles.text}>
            <h3>{h.title}</h3>
            <p>{h.text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}