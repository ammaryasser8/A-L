import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import homeConfig from '../../data/home-config.json';
import { useReducedMotion } from '../../hooks/Usereducedmotion';
import { isLowPowerDevice } from '../../hooks/deviceCapability';
import styles from './GravityScene.module.css';

// Fixed, hand-placed positions (percent of the field) so the composition
// reads as considered rather than randomly scattered. Real category
// labels only — the same ones used in the AL Constellation and site nav.
const PLACEMENTS = [
  { top: '18%', left: '14%', size: 1 },
  { top: '30%', left: '62%', size: 0.72 },
  { top: '52%', left: '22%', size: 0.85 },
  { top: '68%', left: '70%', size: 1.1 },
  { top: '14%', left: '78%', size: 0.6 },
  { top: '80%', left: '40%', size: 0.78 },
  { top: '46%', left: '48%', size: 0.55 },
];

export default function GravityScene() {
  const root = useRef(null);
  const reducedMotion = useReducedMotion();
  const words = homeConfig.homepage.sharedCategories.slice(0, PLACEMENTS.length);

  useEffect(() => {
    const field = root.current;
    if (!field || reducedMotion || !window.matchMedia('(pointer: fine)').matches || isLowPowerDevice()) return undefined;
    const items = Array.from(field.querySelectorAll('[data-gravity-word]'));
    const motion = items.map((item) => ({
      x: gsap.quickTo(item, 'x', { duration: 0.7, ease: 'power3.out' }),
      y: gsap.quickTo(item, 'y', { duration: 0.7, ease: 'power3.out' }),
      scale: gsap.quickTo(item, 'scale', { duration: 0.7, ease: 'power3.out' }),
    }));

    const REACH = 220;
    const onMove = (event) => {
      const bounds = field.getBoundingClientRect();
      const px = event.clientX - bounds.left;
      const py = event.clientY - bounds.top;
      items.forEach((item, index) => {
        const r = item.getBoundingClientRect();
        const cx = r.left + r.width / 2 - bounds.left;
        const cy = r.top + r.height / 2 - bounds.top;
        const dx = cx - px;
        const dy = cy - py;
        const distance = Math.hypot(dx, dy) || 1;
        const push = gsap.utils.clamp(0, 1, 1 - distance / REACH);
        // Gentle repulsion, not attraction: an installation the visitor
        // disturbs as they move through it, rather than a game of chase.
        motion[index].x((dx / distance) * push * 46);
        motion[index].y((dy / distance) * push * 46);
        motion[index].scale(1 - push * 0.08);
      });
    };
    const onLeave = () => motion.forEach((item) => { item.x(0); item.y(0); item.scale(1); });

    field.addEventListener('mousemove', onMove);
    field.addEventListener('mouseleave', onLeave);
    return () => {
      field.removeEventListener('mousemove', onMove);
      field.removeEventListener('mouseleave', onLeave);
    };
  }, [reducedMotion]);

  return (
    <section ref={root} className={styles.gravity} aria-hidden="true">
      <span className={styles.centreMark}>AL</span>
      {words.map((category, index) => {
        const placement = PLACEMENTS[index];
        return (
          <div key={category.label} className={styles.floatWrap} style={{ top: placement.top, left: placement.left, animationDelay: `${index * -1.3}s` }}>
            <span data-gravity-word className={styles.word} style={{ fontSize: `${placement.size}em` }}>{category.label}</span>
          </div>
        );
      })}
    </section>
  );
}