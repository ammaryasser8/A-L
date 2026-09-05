import styles from './MarisolExperiences.module.css';

const EXPERIENCES = [
  { title: 'Water Activities', text: 'Adventure on the crystal-clear sea.' },
  { title: 'Sunset Yoga', text: 'Find balance with ocean sunsets.' },
  { title: 'Private Dining', text: 'Unforgettable moments, just for you.' },
  { title: 'Wellness Journey', text: 'Tailored treatments for total relaxation.' },
  { title: 'Local Discovery', text: 'Explore culture, nature, and hidden gems.' },
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
            <div className={styles.image} />
            <h3>{e.title}</h3>
            <p>{e.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}