import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * The homepage's main scroll choreography: hero entrance + parallax,
 * the convergence "world transformation" seam, entrance reveals for
 * [data-orbit]/[data-reveal] elements, and the pinned horizontal
 * experience track. Everything here is scoped to `root.current` via
 * gsap.context, so cleanup is automatic on unmount or reducedMotion change.
 */
export function useGroupSceneAnimations(root, experienceTrack, reducedMotion) {
  useLayoutEffect(() => {
    if (reducedMotion || !root.current) return undefined;
    const ctx = gsap.context(() => {
      const hero = root.current.querySelector('[data-home-hero]');
      const copy = root.current.querySelector('[data-hero-copy]');
      const heroWorlds = root.current.querySelectorAll('[data-hero-world]');
      // GroupHero now owns its time-based projector opening and footage loop.
      // Retain this optional choreography only for a legacy hero shape, so a
      // future static hero can still opt in without coupling the two systems.
      if (hero && copy && heroWorlds.length) {
        const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroTimeline.from(heroWorlds, { opacity: 0, scale: 1.08, duration: 1.35, stagger: 0.12 })
          .from(copy.children, { y: 28, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=.72');
        gsap.to(heroWorlds[0], { xPercent: -5, scale: 1.08, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to(heroWorlds[1], { xPercent: 5, scale: 1.08, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to(copy, { yPercent: 18, opacity: 0.35, ease: 'none', scrollTrigger: { trigger: hero, start: '35% top', end: 'bottom top', scrub: true } });
      }

      const convergence = root.current.querySelector('[data-convergence]');
      if (convergence) {
        const layers = convergence.querySelectorAll('[data-convergence-layer]');
        const statement = convergence.querySelector('[data-convergence-copy]');
        const pieceA = convergence.querySelector('[data-convergence-piece="a"]');
        const pieceL = convergence.querySelector('[data-convergence-piece="l"]');
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: convergence,
            start: 'top 82%',
            end: 'bottom 18%',
            // A little inertia keeps this editorial reveal from snapping shut
            // when the visitor scrolls through the statement quickly.
            scrub: 1.35,
          },
        });
        timeline
          .fromTo(layers[0], { scale: 1.08 }, { scale: 1.015, duration: 1.25, ease: 'none' })
          .fromTo(layers[1], { scale: 1.08 }, { scale: 1.015, duration: 1.25, ease: 'none' }, '<')
          .fromTo(pieceA, { x: -170, opacity: 0 }, { x: 0, opacity: 1, duration: 1.05, ease: 'none' }, '<')
          .fromTo(pieceL, { x: 170, opacity: 0 }, { x: 0, opacity: 1, duration: 1.05, ease: 'none' }, '<')
          .fromTo(statement, { y: 30, scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 1.05, ease: 'none' }, '<.15')
          .to({}, { duration: 0.7 })
          .to(layers[0], { scale: 1.05, duration: 1.1, ease: 'none' })
          .to(layers[1], { scale: 1.05, duration: 1.1, ease: 'none' }, '<')
          .to(statement, { y: -16, opacity: 0.7, duration: 1.1, ease: 'none' }, '<');
      }

      root.current.querySelectorAll('[data-orbit]').forEach((element, index) => {
        gsap.from(element, { scale: 0.65, opacity: 0, duration: .85, delay: index * .08, ease: 'power3.out', scrollTrigger: { trigger: element.parentElement, start: 'top 72%', once: true } });
      });

      root.current.querySelectorAll('[data-reveal]').forEach((element) => {
        gsap.from(element, { y: 44, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 86%', once: true } });
      });
      const track = experienceTrack.current;
      if (track && window.matchMedia('(min-width: 800px)').matches) {
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth + 56),
          ease: 'none',
          scrollTrigger: { trigger: track.parentElement, start: 'top top', end: () => `+=${track.scrollWidth - window.innerWidth + 200}`, pin: true, scrub: 1, invalidateOnRefresh: true },
        });
      }
    }, root);
    return () => ctx.revert();
  }, [reducedMotion, root, experienceTrack]);
}