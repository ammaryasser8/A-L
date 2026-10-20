import { useEffect } from 'react';
import { gsap } from 'gsap';

// Scene 12 — The Booking Environment: focusing any field of the
// (unmodified) BookingBar makes the cinematic background behind it
// respond — a touch more contrast and saturation — without changing
// how the form itself works. focusin/focusout bubble, so one listener
// on the section covers every field.
export function useBookingFocus(root, reducedMotion) {
  useEffect(() => {
    const section = root.current?.querySelector('[data-booking-scene]');
    const aura = section?.querySelector('[data-booking-aura]');
    if (!section || !aura || reducedMotion) return undefined;
    const onFocusIn = () => gsap.to(aura, { opacity: 0.94, filter: 'saturate(1.2) brightness(1.06)', duration: 0.6, overwrite: true });
    const onFocusOut = () => gsap.to(aura, { opacity: 0.72, filter: 'saturate(1) brightness(1)', duration: 0.8, overwrite: true });
    section.addEventListener('focusin', onFocusIn);
    section.addEventListener('focusout', onFocusOut);
    return () => { section.removeEventListener('focusin', onFocusIn); section.removeEventListener('focusout', onFocusOut); };
  }, [reducedMotion, root]);
}