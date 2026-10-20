import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useReducedMotion } from '../../hooks/Usereducedmotion';
import styles from './GroupExperience.module.css';

const Arrow = () => <span aria-hidden="true" className={styles.arrow}>↗</span>;
const imagePath = (image) => `/${image}`;

// Scene 16 — The Two Portals. Pointer physics (flex-grow) live in the
// parent's usePortalPhysics hook; this component only owns the "click
// transition": the chosen portal consumes the viewport before the real
// navigation.
export default function DestinationPortal({ destination, index }) {
  const { hotel, image, accentClass } = destination;
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  function handleEnter(event) {
    const target = `/hotels/${hotel.slug}`;
    if (reducedMotion) return; // let the <Link> navigate immediately, as usual
    event.preventDefault();
    const mine = event.currentTarget.closest('[data-portal]');
    const container = mine?.closest('[data-portals]');
    const portals = container ? Array.from(container.querySelectorAll('[data-portal]')) : [];
    const overlays = mine ? Array.from(mine.children).filter((el) => !el.hasAttribute('data-portal-image')) : [];
    const timeline = gsap.timeline({ onComplete: () => navigate(target) });
    portals.forEach((portal) => {
      timeline.to(portal, { flexGrow: portal === mine ? 3.2 : 0.05, duration: 0.65, ease: 'power3.inOut' }, 0);
    });
    if (mine) timeline.to(mine.querySelector('[data-portal-image]'), { scale: 1.14, duration: 0.65, ease: 'power3.inOut' }, 0);
    timeline.to(overlays, { opacity: 0, duration: 0.3 }, 0.2);
  }

  return (
    <article data-portal className={`${styles.portal} ${styles[accentClass]}`}>
      <div data-portal-image className={styles.portalImage} style={{ backgroundImage: `url(${imagePath(image)})` }} aria-hidden="true" />
      <div className={styles.portalShade} />
      <div className={styles.portalTop}><span>0{index + 1} / Destination</span><span>{hotel.address.city}, {hotel.address.country}</span></div>
      <div className={styles.portalContent}>
        <p className={styles.eyebrow}>{hotel.type}</p>
        <h2>{hotel.shortName}</h2>
        <h3>{hotel.tagline}</h3>
        <p>{hotel.description}</p>
        <Link data-cursor="Enter" to={`/hotels/${hotel.slug}`} onClick={handleEnter} className={styles.lineLink}>Discover {hotel.shortName} <Arrow /></Link>
      </div>
      <span className={styles.ghostNumber}>0{index + 1}</span>
    </article>
  );
}