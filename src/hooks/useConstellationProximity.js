import { useEffect } from 'react';
import { gsap } from 'gsap';
import { isLowPowerDevice } from '../hooks/deviceCapability';

// Scene 05 — The AL Constellation: a real proximity system. Distance
// from the pointer to each orbiting item drives its scale/translation
// and the intensity of its connecting line back to the AL core, all via
// GSAP quickTo on refs — no React state on pointer move.
export function useConstellationProximity(root, reducedMotion) {
  useEffect(() => {
    const field = root.current?.querySelector('[data-orbit-field]');
    if (!field || reducedMotion || !window.matchMedia('(pointer: fine)').matches || isLowPowerDevice()) return undefined;
    const core = field.querySelector('[data-orbit-core]');
    const items = Array.from(field.querySelectorAll('[data-orbit]'));
    const lines = items.map((_, index) => field.querySelector(`[data-orbit-line-to="${index}"]`));
    const itemMotion = items.map((item) => ({
      scale: gsap.quickTo(item, 'scale', { duration: 0.5, ease: 'power3.out' }),
      x: gsap.quickTo(item, 'x', { duration: 0.6, ease: 'power3.out' }),
      y: gsap.quickTo(item, 'y', { duration: 0.6, ease: 'power3.out' }),
    }));
    const coreScale = gsap.quickTo(core, 'scale', { duration: 0.5, ease: 'power3.out' });

    let itemCenters = [];
    let coreCenter = { x: 0, y: 0 };
    const measure = () => {
      const fieldRect = field.getBoundingClientRect();
      const coreRect = core.getBoundingClientRect();
      coreCenter = { x: coreRect.left + coreRect.width / 2 - fieldRect.left, y: coreRect.top + coreRect.height / 2 - fieldRect.top };
      itemCenters = items.map((item) => {
        const r = item.getBoundingClientRect();
        return { x: r.left + r.width / 2 - fieldRect.left, y: r.top + r.height / 2 - fieldRect.top };
      });
      itemCenters.forEach((center, index) => {
        const line = lines[index];
        if (!line) return;
        line.setAttribute('x1', coreCenter.x);
        line.setAttribute('y1', coreCenter.y);
        line.setAttribute('x2', center.x);
        line.setAttribute('y2', center.y);
      });
    };
    measure();
    window.addEventListener('resize', measure);

    const REACH = 260; // px — how far a visitor's pointer reaches into the field
    const onMove = (event) => {
      const fieldRect = field.getBoundingClientRect();
      const px = event.clientX - fieldRect.left;
      const py = event.clientY - fieldRect.top;
      let nearestDistance = Infinity;
      itemCenters.forEach((center, index) => {
        const distance = Math.hypot(px - center.x, py - center.y);
        nearestDistance = Math.min(nearestDistance, distance);
        const proximity = gsap.utils.clamp(0, 1, 1 - distance / REACH);
        // The item itself drifts slightly toward the pointer and grows —
        // this is the "selected item moves toward the user" behaviour.
        itemMotion[index].scale(1 + proximity * 0.22);
        itemMotion[index].x((px - center.x) * proximity * 0.12);
        itemMotion[index].y((py - center.y) * proximity * 0.12);
        const line = lines[index];
        if (line) {
          line.style.opacity = String(0.14 + proximity * 0.76);
          line.style.strokeWidth = String(1 + proximity * 1.6);
        }
      });
      const centerProximity = gsap.utils.clamp(0, 1, 1 - nearestDistance / REACH);
      coreScale(1 + centerProximity * 0.16);
    };
    const onLeave = () => {
      itemMotion.forEach((motion, index) => {
        motion.scale(1); motion.x(0); motion.y(0);
        const line = lines[index];
        if (line) { line.style.opacity = '0.18'; line.style.strokeWidth = '1'; }
      });
      coreScale(1);
    };

    field.addEventListener('mousemove', onMove);
    field.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('resize', measure);
      field.removeEventListener('mousemove', onMove);
      field.removeEventListener('mouseleave', onLeave);
    };
  }, [reducedMotion, root]);
}