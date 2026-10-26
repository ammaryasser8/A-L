import { Link } from 'react-router-dom';
import styles from './GroupExperience.module.css';

const Arrow = () => <span aria-hidden="true" className={styles.arrow}>↗</span>;

export default function DualWorldsSection() {
  return (
    <section id="dual-worlds" data-dual-worlds className={styles.dual}>
      <svg className={styles.boundarySvgDual} aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="al-world-left-dual" clipPathUnits="objectBoundingBox">
            <path data-dual-boundary-left d="M0,0 L0.5,0 L0.5,1 L0,1 Z" />
          </clipPath>
          <clipPath id="al-world-right-dual" clipPathUnits="objectBoundingBox">
            <path data-dual-boundary-right d="M0.5,0 L1,0 L1,1 L0.5,1 Z" />
          </clipPath>
        </defs>
      </svg>
      <div data-dual-left className={`${styles.dualSide} ${styles.dualAurelia}`}>
        <div data-dual-left-image className={styles.dualImage} />
        <Link to="/hotels/aurelia-grand-hotel" className={styles.dualCover} tabIndex={-1} aria-hidden="true" />
        <div className={styles.dualContent}>
          <span>01 / Heritage</span>
          <h2>Stone.<br /><em>Ceremony.</em></h2>
          <p>Gilded detail, Nile light, a sense of history in every arrival.</p>
          <Link to="/hotels/aurelia-grand-hotel" className={styles.dualButton}>Enter Aurelia <Arrow /></Link>
        </div>
      </div>
      <div data-dual-right className={`${styles.dualSide} ${styles.dualMarisol}`}>
        <div data-dual-right-image className={styles.dualImage} />
        <Link to="/hotels/marisol-bay-resort" className={styles.dualCover} tabIndex={-1} aria-hidden="true" />
        <div className={styles.dualContent}>
          <span>02 / Horizon</span>
          <h2>Sea.<br /><em>Freedom.</em></h2>
          <p>Open water, unhurried days, an architecture of calm.</p>
          <Link to="/hotels/marisol-bay-resort" className={styles.dualButton}>Enter Marisol <Arrow /></Link>
        </div>
      </div>
      <div className={styles.dualSeam} aria-hidden="true"><span>AL</span></div>
    </section>
  );
}