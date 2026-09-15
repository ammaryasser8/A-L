import { useEffect, useRef } from 'react';

/**
 * Attach the returned ref to a horizontally-scrollable container.
 * On desktop (fine pointer), vertical wheel input scrolls it horizontally —
 * this gives the "room storytelling" feel from the brief without hijacking
 * scroll or requiring GSAP ScrollTrigger. Touch devices are left untouched
 * so native swipe still works exactly as expected.
 */
export function useWheelHorizontalScroll() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return undefined;

    function onWheel(e) {
      // Only take over when the user is scrolling more vertically than
      // horizontally already (keeps trackpad horizontal swipe untouched).
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return ref;
}