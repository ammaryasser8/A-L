import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './CustomCursor.module.css';

export default function CustomCursor({ variant = 'group' }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [active] = useState(() => (
    window.matchMedia('(pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));
  const [label, setLabel] = useState('');
  const [hoveringInteractive, setHoveringInteractive] = useState(false);

  useEffect(() => {
    if (!active) return undefined;
    document.documentElement.classList.add('customCursorActive');

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };

    function onMove(e) {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dotRef.current) gsap.set(dotRef.current, { x: pos.x, y: pos.y });

      const labelTarget = e.target.closest?.('[data-cursor]');
      setLabel(labelTarget ? labelTarget.getAttribute('data-cursor') : '');
      setHoveringInteractive(Boolean(e.target.closest?.('button, a, input, select, [data-cursor]')));
    }

    function ringTick() {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      if (ringRef.current) gsap.set(ringRef.current, { x: ringPos.x, y: ringPos.y });
    }

    window.addEventListener('mousemove', onMove);
    gsap.ticker.add(ringTick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      gsap.ticker.remove(ringTick);
      document.documentElement.classList.remove('customCursorActive');
    };
  }, [active]);

  if (!active) return null;

  const ringClass = [
    styles.ring,
    hoveringInteractive ? styles.ringBig : '',
    label ? styles.ringLabeled : '',
  ].join(' ');

  return (
    <>
      <div ref={dotRef} className={`${styles.dot} ${styles[variant] || ''}`} />
      <div ref={ringRef} className={`${ringClass} ${styles[variant] || ''}`}>
        {label && <span>{label}</span>}
      </div>
    </>
  );
}
