import styles from './HeroSplit.module.css';
import HotelIntroCard from './HotelIntroCard';

export default function HeroSplit({ homeConfig, hotels }) {
  const { heroTitle, heroSubtitle, hotelCards } = homeConfig.homepage;

  return (
    <section className={styles.hero}>
      <div className={`wrap ${styles.heroInner}`}>
        <div className={styles.eyebrow}>{homeConfig.group.name}</div>
        <h1>{heroTitle}</h1>
        <p>{heroSubtitle}</p>
      </div>

      <div className={`wrap ${styles.hotelSplit}`}>
        {hotelCards.map((card) => {
          const hotel = hotels.find((h) => h.id === card.hotelId);
          return <HotelIntroCard key={card.hotelId} card={card} hotel={hotel} />;
        })}
      </div>
    </section>
  );
}
