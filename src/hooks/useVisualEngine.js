import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * The AL homepage "engine": a single source of truth for the real-time
 * signals the whole page reacts to (scroll progress/velocity, pointer
 * position/velocity, and which world — Aurelia or Marisol — currently
 * has visual dominance).
 *
 * Design intent (see project brief, "DO NOT OVERUSE REACT STATE"):
 * - Every value here is written directly to CSS custom properties on
 *   <html>, smoothed with GSAP quickTo. Nothing here triggers a React
 *   re-render, so scenes can read `var(--pointer-x)` etc. in their CSS
 *   without the engine ever causing the component tree to update.
 * - React state stays reserved for semantic state (menu open, selected
 *   stay, active scene) — that lives in the components themselves.
 *
 * Published CSS variables (all on document.documentElement):
 *   --pointer-x, --pointer-y      0..1, damped pointer position
 *   --pointer-velocity            0..1, damped pointer speed
 *   --scroll-progress             0..1, page scroll position
 *   --scroll-velocity            -1..1, damped scroll speed/direction
 *   --world-progress               0..1, 0 = Aurelia dominant, 1 = Marisol
 *                                   dominant, 0.5 = neutral AL identity
 *
 * Returns an imperative API so a scene (e.g. the dual-world hero, later
 * the two portals) can drive --world-progress from its own interaction,
 * while every other scene can simply read the variable.
 */
export function useVisualEngine({ reducedMotion = false } = {}) {
  // The mutable implementation lives on a ref (effects are allowed to
  // write to a ref's .current at any time). The object returned to the
  // caller is a stable, never-mutated proxy created once with useMemo —
  // its methods simply defer to whatever the ref currently holds, so it
  // stays safe to read during render while the real behaviour can still
  // be (re)wired inside the effect below.
  const impl = useRef({ setWorldProgress: null, worldProgress: 0.5 });

  const api = useMemo(() => ({
    setWorldProgress: (value) => impl.current.setWorldProgress?.(value),
    getWorldProgress: () => impl.current.worldProgress,
  }), [impl]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--pointer-x', '0.5');
    root.style.setProperty('--pointer-y', '0.5');
    root.style.setProperty('--pointer-velocity', '0');
    root.style.setProperty('--scroll-progress', '0');
    root.style.setProperty('--scroll-velocity', '0');
    root.style.setProperty('--world-progress', '0.5');

    if (reducedMotion) {
      // Respect prefers-reduced-motion: publish static values only, no
      // pointer/scroll tracking, no per-frame writes.
      impl.current.setWorldProgress = (value) => {
        impl.current.worldProgress = value;
        root.style.setProperty('--world-progress', String(value));
      };
      return undefined;
    }

    const setPointerX = gsap.quickTo(root, '--pointer-x', { duration: 0.5, ease: 'power3.out' });
    const setPointerY = gsap.quickTo(root, '--pointer-y', { duration: 0.5, ease: 'power3.out' });
    const setPointerVelocity = gsap.quickTo(root, '--pointer-velocity', { duration: 0.35, ease: 'power2.out' });
    const setScrollVelocity = gsap.quickTo(root, '--scroll-velocity', { duration: 0.45, ease: 'power2.out' });
    const setWorldProgress = gsap.quickTo(root, '--world-progress', {
      duration: 0.9,
      ease: 'power3.out',
      onUpdate: () => { impl.current.worldProgress = gsap.getProperty(root, '--world-progress'); },
    });

    impl.current.setWorldProgress = (value) => setWorldProgress(gsap.utils.clamp(0, 1, value));

    let lastPointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, t: performance.now() };
    const onPointerMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      const now = performance.now();
      const dt = Math.max(now - lastPointer.t, 1);
      const dx = event.clientX - lastPointer.x;
      const dy = event.clientY - lastPointer.y;
      const speed = Math.hypot(dx, dy) / dt; // px/ms
      setPointerX(event.clientX / window.innerWidth);
      setPointerY(event.clientY / window.innerHeight);
      setPointerVelocity(gsap.utils.clamp(0, 1, speed / 2.4));
      lastPointer = { x: event.clientX, y: event.clientY, t: now };
    };

    let lastScroll = { y: window.scrollY, t: performance.now() };
    let ticking = false;
    const measureScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = Math.max(now - lastScroll.t, 1);
      const velocity = gsap.utils.clamp(-1, 1, ((y - lastScroll.y) / dt) / 2.2);
      setScrollVelocity(velocity);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty('--scroll-progress', String(max > 0 ? gsap.utils.clamp(0, 1, y / max) : 0));
      lastScroll = { y, t: now };
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(measureScroll); }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, [reducedMotion]);

  return api;
}