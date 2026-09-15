import styles from './MarisolExperiences.module.css';

const EXPERIENCES = [
  {
    title: 'Water Activities',
    text: 'Adventure on the crystal-clear sea.',
    media: '/images/sections/marisol-exp-water.jpg',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M3 17c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0" />
        <path d="M6 17l1-9 9-3 1 6-8 3" />
      </svg>
    ),
  },
  {
    title: 'Sunset Yoga',
    text: 'Find balance with ocean sunsets.',
    media: '/images/sections/marisol-exp-yoga.jpg',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="12" cy="7" r="2.4" />
        <path d="M6 20c1-4 3-6 6-6s5 2 6 6" />
      </svg>
    ),
  },
  {
    title: 'Private Dining',
    text: 'Unforgettable moments, just for you.',
    media: '/images/sections/marisol-exp-dining.jpg',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M12 3v7M9 3v4a3 3 0 0 0 6 0V3" />
        <path d="M12 13v8" />
      </svg>
    ),
  },
  {
    title: 'Wellness Journey',
    text: 'Tailored treatments for total relaxation.',
    media: '/images/sections/marisol-exp-wellness.jpg',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M12 3c2 3 2 5 0 7-2-2-2-4 0-7Z" />
        <path d="M6 12c2 2 2 5 0 7M18 12c-2 2-2 5 0 7" />
      </svg>
    ),
  },
  {
    title: 'Local Discovery',
    text: 'Explore culture, nature, and hidden gems.',
    media: '/images/sections/marisol-exp-discovery.jpg',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.2" />
      </svg>
    ),
  },
];

export default function MarisolExperiences() {
  return (
    <section className={`wrap ${styles.section}`}>
      <div className={styles.head}>
        <span className={styles.eyebrow}>Experiences</span>
        <h2>Crafted for you</h2>
      </div>
      <div className={styles.grid}>
        {EXPERIENCES.map((e) => (
          <div key={e.title} className={styles.card}>
            <div className={styles.image}>
              <div className={styles.marbleBg} />
              <div className={styles.photoLayer} style={{ backgroundImage: `url(${e.media})` }} />
              <span className={styles.icon}>{e.icon}</span>
            </div>
            <h3>{e.title}</h3>
            <p>{e.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}