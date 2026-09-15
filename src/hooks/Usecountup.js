import { useEffect, useState } from 'react';

/**
 * Animates from 0 to `target` over `duration` ms, starting when `trigger`
 * becomes true. Runs once only — re-triggering is ignored, matching the
 * "do not repeatedly animate on scroll up/down" rule.
 */
export function useCountUp(target, trigger, duration = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!trigger) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      const raf = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(raf);
    }

    let raf;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, target, duration]);

  return value;
}
