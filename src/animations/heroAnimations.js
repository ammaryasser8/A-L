import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Builds (and returns) the hero entrance timeline. Call this once the hero
 * has mounted. Pass `reducedMotion = true` to skip straight to the final
 * state instead of animating.
 *
 * refs = { image, eyebrow, heading, subtitle, actions, booking, scrollCue }
 */
export function playHeroIntro(refs, reducedMotion = false) {
  const { image, eyebrow, heading, subtitle, actions, booking, scrollCue } = refs;
  const elements = [eyebrow, heading, subtitle, actions, booking, scrollCue].filter(Boolean);

  if (reducedMotion) {
    const tl = gsap.timeline();
    tl.set(elements, { opacity: 1, y: 0 });
    if (image) tl.set(image, { scale: 1 });
    return tl;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (image) {
    tl.fromTo(image, { scale: 1.08 }, { scale: 1, duration: 1.6, ease: 'power2.out' }, 0);
  }
  if (eyebrow) {
    tl.fromTo(eyebrow, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.4);
  }
  if (heading) {
    tl.fromTo(heading, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, 0.55);
  }
  if (subtitle) {
    tl.fromTo(subtitle, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.8);
  }
  if (actions) {
    tl.fromTo(actions, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 1.0);
  }
  if (booking) {
    tl.fromTo(booking, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, 1.2);
  }
  if (scrollCue) {
    tl.fromTo(scrollCue, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.4);
  }

  return tl;
}

/**
 * Subtle cinematic parallax while the hero scrolls away: image scales up
 * slightly, content moves at a slightly different rate. Kept deliberately
 * gentle per the brief ("cinematic, not a demo"). Returns the ScrollTrigger
 * instance so the caller can kill() it on unmount.
 */
export function attachHeroParallax(sectionEl, imageEl, contentEl, reducedMotion = false) {
  if (reducedMotion || !sectionEl || !imageEl) return null;

  const st = ScrollTrigger.create({
    trigger: sectionEl,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      gsap.set(imageEl, { scale: 1 + self.progress * 0.1 });
      if (contentEl) {
        gsap.set(contentEl, { y: self.progress * 60 });
      }
    },
  });

  return st;
}