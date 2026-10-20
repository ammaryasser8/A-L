import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import homeConfig from '../../data/home-config.json';
import { isLowPowerDevice } from '../../hooks/deviceCapability';
import { useReducedMotion } from '../../hooks/Usereducedmotion';
import styles from './ManifestoScene.module.css';

gsap.registerPlugin(ScrollTrigger);

const Arrow = () => <span aria-hidden="true" className={styles.arrow}>↗</span>;

// Real copy only — the group's own tagline, split at its natural
// sentence boundary, read one phrase at a time before the full
// description closes the scene.
const [firstPhrase, secondPhrase] = homeConfig.group.tagline
  .split('. ')
  .map((part) => (part.endsWith('.') ? part : `${part}.`));

export default function ManifestoScene() {
  const root = useRef(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !root.current || !window.matchMedia('(min-width: 800px)').matches || isLowPowerDevice()) return undefined;
    const ctx = gsap.context(() => {
      const phrases = gsap.utils.toArray('[data-phrase]');
      const closing = root.current.querySelector('[data-closing]');
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=220%',
          scrub: 0.8,
          pin: true,
        },
      });

      gsap.set(phrases, { opacity: 0, y: 26, scale: 0.94 });
      gsap.set(closing, { opacity: 0, y: 26 });

      phrases.forEach((phrase, index) => {
        const at = index * 0.9;
        timeline
          .to(phrase, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' }, at)
          .to(phrase, { opacity: 0, y: -22, scale: 1.03, duration: 0.35, ease: 'power2.in' }, at + 0.55);
      });

      timeline.to(closing, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, phrases.length * 0.9);
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="manifesto" ref={root} className={styles.manifesto} aria-label="The AL Hospitality Group philosophy">
      <div className={styles.sectionLabel}><span>01</span><i />The Group</div>
      <div className={styles.stage}>
        <h2 data-phrase className={styles.phrase}>{firstPhrase}</h2>
        <h2 data-phrase className={styles.phrase}>{secondPhrase}</h2>
        <div data-closing className={styles.closing}>
          <p>{homeConfig.group.description}</p>
          <a className={styles.lineLink} href="#dual-worlds">Meet the two worlds <Arrow /></a>
        </div>
      </div>
    </section>
  );
}