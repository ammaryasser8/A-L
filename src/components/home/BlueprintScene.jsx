import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/Usereducedmotion';
import styles from './BlueprintScene.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene 04 — The Architectural Blueprint. A new visual language for one
 * beat only: thin drafting linework, loosely evoking Aurelia's arches and
 * Marisol's coastline, which draws itself in, holds, then resolves into
 * the AL wordmark before dissolving into the next scene.
 *
 * Static by default (every line, label and the wordmark are simply drawn
 * and visible via CSS, e.g. with reduced motion) — the scroll-driven
 * "draw, hold, resolve" choreography is layered on top. On desktop it pins;
 * on touch it simply follows the scroll (no pinning).
 */
export default function BlueprintScene() {
  const root = useRef(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !root.current) return undefined;
    // Desktop: the section pins and the drawing is scrubbed by scroll.
    // Touch / small screens: same choreography, scrubbed by scroll too, but
    // without pinning so native touch scrolling is never hijacked.
    const desktop = window.matchMedia('(min-width: 800px)').matches;
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray('[data-blueprint-line]');
      const wordmark = gsap.utils.toArray('[data-blueprint-al]');
      const labels = gsap.utils.toArray('[data-blueprint-label]');

      lines.forEach((line) => {
        const length = line.getTotalLength();
        line.style.strokeDasharray = length;
        line.style.strokeDashoffset = length;
      });
      wordmark.forEach((path) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
      });
      gsap.set(labels, { opacity: 0 });
      gsap.set(wordmark, { opacity: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: desktop
          ? { trigger: root.current, start: 'top top', end: '+=170%', scrub: 0.7, pin: true }
          : { trigger: root.current, start: 'top 92%', end: 'bottom 58%', scrub: 0.6 },
      });
      timeline
        .to(lines, { strokeDashoffset: 0, duration: 1, stagger: 0.08, ease: 'none' }, 0)
        .to(labels, { opacity: 0.8, duration: 0.25, stagger: 0.06 }, 0.15)
        .to({}, { duration: 0.25 }, 0.85)
        .to([lines, labels], { opacity: 0, duration: 0.25 }, 0.92)
        .to(wordmark, { strokeDashoffset: 0, opacity: 0.95, duration: 0.4, stagger: 0.05, ease: 'power2.out' }, 1.0);
      if (desktop) {
        timeline.to({}, { duration: 0.2 }, 1.5).to(wordmark, { opacity: 0, duration: 0.22 }, 1.68);
      }
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={root} className={styles.blueprint} aria-hidden="true">
      <svg className={styles.canvas} viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid meet">
        {/* Aurelia-inspired: an arch and a column grid */}
        <path data-blueprint-line d="M120,560 L120,220 A120,120 0 0 1 360,220 L360,560" />
        <path data-blueprint-line d="M180,560 L180,300" />
        <path data-blueprint-line d="M300,560 L300,300" />
        <path data-blueprint-line d="M120,560 L360,560" />
        {/* Marisol-inspired: a horizon and receding contour lines */}
        <path data-blueprint-line d="M780,340 C900,300 1000,300 1120,340" />
        <path data-blueprint-line d="M760,420 C900,460 1020,460 1140,420" />
        <path data-blueprint-line d="M760,500 C900,540 1020,540 1140,500" />
        {/* connective centre line, echoing the seam from earlier scenes */}
        <path data-blueprint-line d="M600,120 L600,580" />

        <text data-blueprint-label className={styles.label} x="120" y="600">A — 01</text>
        <text data-blueprint-label className={styles.label} x="780" y="600">M — 02</text>
        <text data-blueprint-label className={styles.label} x="555" y="105">AL — 03</text>

        <g>
          <path data-blueprint-al className={styles.wordmark} d="M560,470 L600,330 L640,470" />
          <path data-blueprint-al className={styles.wordmark} d="M574,420 L626,420" />
          <path data-blueprint-al className={styles.wordmark} d="M670,330 L670,470 L720,470" />
        </g>
      </svg>
    </section>
  );
}