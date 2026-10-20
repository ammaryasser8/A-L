import styles from './GroupExperience.module.css';

export default function VoicesSection({ guestVoices }) {
  return (
    <section className={styles.voices}>
      <div className={styles.sectionLabel}><span>05</span><i />Guest voices</div>
      <h2 data-reveal>Remembered for<br />how it <em>felt.</em></h2>
      <div className={styles.voiceGrid}>
        {guestVoices.map(({ hotel, review, product }) => (
          <article key={hotel.id}>
            <span>{hotel.shortName} / {product.title}</span>
            <blockquote>“{review.comment}”</blockquote>
            <p>{review.author} · Verified guest rating {review.rating}/5</p>
          </article>
        ))}
      </div>
    </section>
  );
}