import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';

/**
 * Mount this ONCE near the app root. It sets up Lenis smooth scrolling and
 * drives it from the GSAP ticker so GSAP-based scroll animations and Lenis
 * stay in sync. Does nothing on touch devices or when the user has asked
 * for reduced motion — native scrolling is used there instead.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReduced) return undefined;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });
    // The router uses this single shared instance to reset a new route without
    // creating a second Lenis controller.
    window.__alLenis = lenis;

    function raf(time) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      if (window.__alLenis === lenis) delete window.__alLenis;
    };
  }, []);

  return null;
}
