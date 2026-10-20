import { useEffect } from 'react';
import { gsap } from 'gsap';
import { isLowPowerDevice } from '../hooks/deviceCapability';

// Scene 16 — Portal Physics: the pointer's horizontal position grows the
// portal it leans toward and shrinks the other, via flex-grow (animatable,
// unlike grid-template-columns). Centre keeps both at parity. Feeds the
// same shared --world-progress signal used by the hero and dual-worlds.
export function usePortalPhysics(root, reducedMotion, engine) {
  useEffect(() => {
    const container = root.current?.querySelector('[data-portals]');
    if (!container || reducedMotion || !window.matchMedia('(pointer: fine)').matches || isLowPowerDevice()) return undefined;
    const portals = Array.from(container.querySelectorAll('[data-portal]'));
    if (portals.length !== 2) return undefined;
    const grow = portals.map((portal) => gsap.quickTo(portal, 'flexGrow', { duration: 0.8, ease: 'power3.out' }));
    const onMove = (event) => {
      const bounds = container.getBoundingClientRect();
      const ratio = (event.clientX - bounds.left) / bounds.width - 0.5;
      grow[0](gsap.utils.clamp(0.55, 1.8, 1 - ratio * 1.6));
      grow[1](gsap.utils.clamp(0.55, 1.8, 1 + ratio * 1.6));
      engine?.setWorldProgress(0.5 + ratio);
    };
    const onLeave = () => { grow[0](1); grow[1](1); engine?.setWorldProgress(0.5); };
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
    return () => { container.removeEventListener('mousemove', onMove); container.removeEventListener('mouseleave', onLeave); };
  }, [reducedMotion, engine, root]);
}