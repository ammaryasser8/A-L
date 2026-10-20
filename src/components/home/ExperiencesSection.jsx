import { Link } from 'react-router-dom';
import hotels from '../../data/hotels.json';
import styles from './GroupExperience.module.css';

const Arrow = () => <span aria-hidden="true" className={styles.arrow}>↗</span>;
const imagePath = (image) => `/${image}`;

export default function ExperiencesSection({ experiences, trackRef }) {
  return (
    <section id="experiences" className={styles.experienceSection}>
      <div className={styles.experienceIntro}><div className={styles.sectionLabel}><span>03</span><i />Curated experiences</div><p className={styles.eyebrow}>Across the collection</p><h2>There is more<br />than one way to <em>feel.</em></h2><p>Spaces, rituals and moments selected from the actual experiences at both addresses.</p></div>
      <div className={styles.experiencePin}>
        <div ref={trackRef} className={styles.experienceTrack}>
          {experiences.map((experience) => {
            const hotel = hotels.find((item) => item.id === experience.product.hotelId);
            return hotel ? (
              <Link key={experience.label} to={`/hotels/${hotel.slug}/product/${experience.product.slug}`} className={styles.experienceCard} data-cursor="View">
                <div className={styles.cardImage} style={{ backgroundImage: `url(${imagePath(experience.product.images[0])})` }} />
                <div className={styles.cardMeta}><span>{experience.number} / {experience.label}</span><strong>{experience.product.title}</strong><p>{experience.product.shortDescription}</p><Arrow /></div>
              </Link>
            ) : null;
          })}
        </div>
      </div>
    </section>
  );
}