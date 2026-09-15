import { useEffect, useRef, useState } from 'react';
import styles from './MarisolCursor.module.css';

/** A restrained cursor that belongs to Marisol's coastal, editorial world. */
export default function MarisolCursor() {
  const haloRef = useRef(null);
  const dotRef = useRef(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const query = window.matchMedia('(pointer: fine)');
    if (!query.matches) return undefined;

    const halo = haloRef.current;
    const dot = dotRef.current;
    let frame;
    let x = -100;
    let y = -100;

    const move = (event) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(() => {
        halo.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        frame = undefined;
      });
    };
    const enter = (event) => {
      const target = event.target.closest('a, button, input, select, [data-cursor]');
      halo.dataset.active = target ? 'true' : 'false';
      setLabel(target?.getAttribute('data-cursor') || (target?.matches('a') ? 'DISCOVER' : target ? 'OPEN' : ''));
    };

    document.body.classList.add('marisol-cursor-active');
    window.addEventListener('pointermove', move);
    document.addEventListener('pointerover', enter);
    return () => {
      document.body.classList.remove('marisol-cursor-active');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', enter);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <div className={styles.cursor} aria-hidden="true"><i ref={haloRef}>{label && <span>{label}</span>}</i><b ref={dotRef} /></div>;
}
