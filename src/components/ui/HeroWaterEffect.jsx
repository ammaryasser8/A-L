import { Suspense, lazy, useEffect, useState } from 'react';
import styles from './HeroWaterEffect.module.css';

const WaterCanvas = lazy(() => import('./WaterCanvas'));

/**
 * Purely decorative — the real hero photo/video is always there underneath
 * and unaffected if this never loads. Disabled on touch devices, small
 * screens, and reduced-motion; paused (not destroyed) when scrolled out of
 * view via IntersectionObserver.
 */
export default function HeroWaterEffect({ containerRef }) {
  const [supported] = useState(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !isTouch && !prefersReduced && window.innerWidth >= 900;
  });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!supported || !containerRef?.current) return undefined;

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.05,
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [supported, containerRef]);

  if (!supported) return null;

  return (
    <div className={styles.wrap} aria-hidden="true">
      <Suspense fallback={null}>
        <WaterCanvas active={visible} />
      </Suspense>
    </div>
  );
}
