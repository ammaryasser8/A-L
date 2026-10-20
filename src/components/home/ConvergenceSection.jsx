import styles from './GroupExperience.module.css';

// "AL" monogram, split like a precision-cut puzzle: the A is cut from the
// Marisol photo and sits inside the Aurelia half; the L is cut from the
// Aurelia photo and sits inside the Marisol half. The two pieces meet at the
// centre seam and lock together to spell AL.
const A_PATH = 'M90,560 L235,0 L355,0 L500,560 L420,560 L384,420 L206,420 L170,560 Z M295,77 L364,345 L225,345 Z';
const L_PATH = 'M500,0 L580,0 L580,480 L860,480 L860,560 L500,560 Z';

export default function ConvergenceSection() {
  return (
    <section data-convergence className={styles.convergence} aria-label="Different in spirit, united in excellence">
      <div data-convergence-layer className={`${styles.convergenceImage} ${styles.convergenceAurelia}`} aria-hidden="true" />
      <div data-convergence-layer className={`${styles.convergenceImage} ${styles.convergenceMarisol}`} aria-hidden="true" />
      <svg className={styles.alMark} viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="al-piece-a"><path d={A_PATH} clipRule="evenodd" /></clipPath>
          <clipPath id="al-piece-l"><path d={L_PATH} /></clipPath>
        </defs>
        <g transform="translate(25 0)">
          <g data-convergence-piece="a">
            <g clipPath="url(#al-piece-a)">
              <image href="/images/products/117-1.jpg" x="60" y="-40" width="480" height="640" preserveAspectRatio="xMidYMid slice" />
              <rect x="60" y="-40" width="480" height="640" fill="rgba(0,39,44,.28)" />
            </g>
            <path d={A_PATH} fillRule="evenodd" className={styles.alStroke} />
          </g>
          <g data-convergence-piece="l">
            <g clipPath="url(#al-piece-l)">
              <image href="/images/products/16-1.jpg" x="480" y="-40" width="400" height="640" preserveAspectRatio="xMidYMid slice" />
              <rect x="480" y="-40" width="400" height="640" fill="rgba(55,7,21,.28)" />
            </g>
            <path d={L_PATH} className={styles.alStroke} />
          </g>
        </g>
      </svg>
      <div data-convergence-copy className={styles.convergenceCopy}><span>AL / 02</span><strong>Different in spirit.<br /><em>United in excellence.</em></strong><i>AL</i></div>
    </section>
  );
}