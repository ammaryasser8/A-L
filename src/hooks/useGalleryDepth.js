import { useEffect } from 'react';
import { gsap } from 'gsap';
import { isLowPowerDevice } from '../hooks/deviceCapability';

// Scene 07 — Immersive Gallery depth system: each figure carries a
// data-depth (0..1) and drifts under the pointer proportionally to it,
// so the composition reads as background/midground/foreground rather
// than a flat grid. Fast scrolling (read from the engine's shared
// --scroll-velocity signal) briefly adds a little extra kinetic energy.
export function useGalleryDepth(root, reducedMotion) {
  useEffect(() => {
    const section = root.current?.querySelector('[data-gallery]');
    if (!section || reducedMotion || !window.matchMedia('(pointer: fine)').matches || isLowPowerDevice()) return undefined;
    const layers = Array.from(section.querySelectorAll('[data-depth]')).map((layer) => ({
      el: layer,
      depth: parseFloat(layer.dataset.depth) || 0.5,
      x: gsap.quickTo(layer, 'x', { duration: 0.7, ease: 'power3.out' }),
      y: gsap.quickTo(layer, 'y', { duration: 0.7, ease: 'power3.out' }),
    }));
    const onMove = (event) => {
      const bounds = section.getBoundingClientRect();
      const rx = (event.clientX - bounds.left) / bounds.width - 0.5;
      const ry = (event.clientY - bounds.top) / bounds.height - 0.5;
      const velocity = Math.abs(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scroll-velocity')) || 0);
      const energy = 1 + velocity * 1.4;
      layers.forEach((layer) => {
        layer.x(rx * 26 * layer.depth * energy);
        layer.y(ry * 22 * layer.depth * energy);
      });
    };
    const onLeave = () => { layers.forEach((layer) => { layer.x(0); layer.y(0); }); };
    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    return () => { section.removeEventListener('mousemove', onMove); section.removeEventListener('mouseleave', onLeave); };
  }, [reducedMotion, root]);
}