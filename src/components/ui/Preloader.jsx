import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './Preloader.module.css';

export default function Preloader({ label, onComplete }) {
  const overlayRef = useRef(null);
  const brandRef = useRef(null);
  const barRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      onComplete?.();
      return undefined;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => onComplete?.(),
      });

      tl.to(barRef.current, {
        scaleX: 1,
        duration: 1.3,
        ease: 'power2.inOut',
      })
        .to(brandRef.current, { y: -16, opacity: 0, duration: 0.4 }, '-=0.15')
        .to(overlayRef.current, { opacity: 0, duration: 0.5 }, '-=0.2');
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (reducedMotion) return null;

  return (
    <div ref={overlayRef} className={styles.overlay}>
      <div ref={brandRef} className={styles.brand}>
        {label}
      </div>
      <div className={styles.barTrack}>
        <div ref={barRef} className={styles.barFill} />
      </div>
    </div>
  );
}