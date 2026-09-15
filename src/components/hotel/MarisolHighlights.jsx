import { useReveal } from '../../hooks/useReveal';
import styles from './MarisolHighlights.module.css';

const FEATURES = [
  {
    number: '01',
    title: 'Infinity Views',
    text: 'Where the pool line dissolves into the horizon, and the horizon dissolves into the sky.',
    media: '/images/sections/marisol-highlight-views.jpg',
    size: 'large',
  },
  {
    number: '02',
    title: 'Minimalist Design',
    text: 'Natural stone, warm oak, and nothing that competes with the view.',
    media: '/images/sections/marisol-highlight-design.jpg',
    size: 'small',
  },
  {
    number: '03',
    title: 'Exquisite Dining',
    text: 'Coastal plates, quietly composed, served as the light changes.',
    media: '/images/sections/marisol-highlight-dining.jpg',
    size: 'small',
  },
  {
    number: '04',
    title: 'Holistic Spa',
    text: 'Water, stone, and silence — treatments built around slowness.',
    media: '/images/sections/marisol-highlight-spa.jpg',
    size: 'small',
  },
];

function FeatureCard({ feature }) {
  const [ref, visible] = useReveal();
  const cardClass = [
    styles.card,
    feature.size === 'large' ? styles.large : styles.small,
    visible ? styles.visible : '',
  ].join(' ');

  return (
    <div ref={ref} className={cardClass}>
      <div className={styles.image}>
        <div className={styles.marbleBg} />
        <div className={styles.photoLayer} style={{ backgroundImage: `url(${feature.media})` }} />
      </div>
      <div className={styles.cardContent}>
        <span className={styles.number}>{feature.number}</span>
        <h3>{feature.title}</h3>
        <p>{feature.text}</p>
        <span className={styles.arrow}>→</span>
      </div>
    </div>
  );
}

export default function MarisolHighlights() {
  const large = FEATURES.find((f) => f.size === 'large');
  const small = FEATURES.filter((f) => f.size === 'small');

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <FeatureCard feature={large} />
        <div className={styles.smallStack}>
          {small.map((f) => (
            <FeatureCard key={f.title} feature={f} />
          ))}
        </div>
      </div>
    </section>
  );
}