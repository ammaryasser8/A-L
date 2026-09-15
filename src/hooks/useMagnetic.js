import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Attach the returned ref to a button. On desktop (fine pointer, no
 * reduced-motion preference), the button subtly follows the cursor while
 * hovered and eases back to rest on leave. Max movement is capped by
 * `strength` (px). Disabled entirely on touch devices.
 */
export function useMagnetic(strength = 14) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReduced) return undefined;

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: (relX / rect.width) * strength,
        y: (relY / rect.height) * strength,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    function onLeave() {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength]);

  return ref;
}