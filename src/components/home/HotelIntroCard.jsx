import styles from './HotelIntroCard.module.css';

export default function HotelIntroCard({ card, hotel }) {
  if (!hotel) return null;

  const { primary, primaryDark, accentLight } = hotel.theme.colors;

  return (
    <a
      href={card.path}
      className={styles.card}
      style={{ background: `linear-gradient(155deg, ${primary}, ${primaryDark})` }}
    >
      <span className={styles.tag}>{card.location}</span>
      <h2 className={styles.title}>{card.name}</h2>
      <p className={styles.blurb}>{card.blurb}</p>
      <div className={styles.meta}>
        <span>{hotel.starRating.toFixed(1)}★ rated</span>
        <span>From ${card.startingPrice.toFixed(2)}</span>
        <span>Est. {hotel.established}</span>
      </div>
      <span
        className={styles.cta}
        style={{ color: accentLight, borderColor: accentLight }}
      >
        Explore {card.name} →
      </span>
    </a>
  );
}