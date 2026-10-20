import hotels from '../../data/hotels.json';
import homeConfig from '../../data/home-config.json';
import styles from './GroupExperience.module.css';

// Real copy only: the second clause of the group's own tagline, reused as
// the gallery's closing caption rather than inventing new marketing copy.
const secondTagline = homeConfig.group.tagline.split('. ')[1];

export default function GallerySection() {
  return (
    <section className={styles.gallery} aria-label="A closer look at the AL collection" data-gallery>
      <p className={styles.galleryLabel}>Fragments of a stay / Cairo to the Red Sea</p>
      <figure className={`${styles.galleryItem} ${styles.galleryTall}`} data-depth="1"><img src="/images/products/20-1.jpg" alt="Architectural detail at Aurelia Grand Hotel"  loading="lazy" /><figcaption><span>Aurelia / a sense of arrival</span><em>{hotels.find((hotel) => hotel.id === 1)?.tagline}</em></figcaption></figure>
      <figure className={`${styles.galleryItem} ${styles.galleryWide}`} data-depth="0.55"><img src="/images/products/110-1.jpg" alt="Sea-facing view at Marisol Bay Resort"  loading="lazy" /><figcaption><span>Marisol / room to breathe</span><em>{hotels.find((hotel) => hotel.id === 2)?.tagline}</em></figcaption></figure>
      <p className={styles.galleryStatement} data-depth="0.25">The details are<br /><em>the destination.</em></p>
      <figure className={`${styles.galleryItem} ${styles.gallerySquare}`} data-depth="0.8"><img src="/images/products/10-1.jpg" alt="A considered AL hospitality experience"  loading="lazy" /><figcaption><span>Every moment, composed</span><em>{secondTagline}</em></figcaption></figure>
    </section>
  );
}