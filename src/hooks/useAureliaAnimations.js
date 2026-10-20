import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Drives every [data-gsap-*]-tagged element on the Aurelia hotel page:
 * gold dividers, titles, image parallax + clip reveal, floating gold
 * accents, room-card hover/entrance, and the final full-bleed image.
 * Returns a ref the page attaches to its root element so gsap.context
 * can scope (and clean up) every animation declared here.
 */
export function useAureliaAnimations() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return undefined;

    const ctx = gsap.context(() => {

      /* ---------------------------------------------
         GOLD DIVIDERS
      --------------------------------------------- */

      gsap.utils
        .toArray('[data-gsap-line]')
        .forEach((line) => {
          gsap.fromTo(
            line,
            {
              scaleX: 0,
              transformOrigin: 'left center',
            },
            {
              scaleX: 1,
              duration: 1.35,
              ease: 'power4.inOut',
              scrollTrigger: {
                trigger: line,
                start: 'top 88%',
                once: true,
              },
            }
          );
        });


      /* ---------------------------------------------
         TITLES
      --------------------------------------------- */

      gsap.utils
        .toArray('[data-gsap-title]')
        .forEach((title) => {
          gsap.fromTo(
            title,
            {
              opacity: 0,
              y: 55,
              filter: 'blur(7px)',
            },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 1.25,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: title,
                start: 'top 84%',
                once: true,
              },
            }
          );
        });


      /* ---------------------------------------------
         IMAGE PARALLAX
      --------------------------------------------- */

      gsap.utils
        .toArray('[data-gsap-image]')
        .forEach((container) => {
          const image = container.querySelector(
            '[data-gsap-image-inner]'
          );

          if (!image) return;

          gsap.fromTo(
            image,
            {
              yPercent: -8,
              scale: 1.12,
            },
            {
              yPercent: 8,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: container,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.8,
              },
            }
          );
        });


      /* ---------------------------------------------
         IMAGE CLIP REVEAL
      --------------------------------------------- */

      gsap.utils
        .toArray('[data-gsap-image]')
        .forEach((container) => {
          gsap.fromTo(
            container,
            {
              clipPath: 'inset(0 0 100% 0)',
            },
            {
              clipPath: 'inset(0 0 0% 0)',
              duration: 1.5,
              ease: 'power4.inOut',
              scrollTrigger: {
                trigger: container,
                start: 'top 82%',
                once: true,
              },
            }
          );
        });


      /* ---------------------------------------------
         FLOATING GOLD ELEMENTS
      --------------------------------------------- */

      gsap.utils
        .toArray('[data-gsap-float]')
        .forEach((element, index) => {
          gsap.to(element, {
            y: index % 2 === 0 ? -12 : 12,
            duration: 4 + index * 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        });


      /* ---------------------------------------------
         ROOM IMAGE HOVER
      --------------------------------------------- */

      gsap.utils
        .toArray('[data-gsap-card]')
        .forEach((card) => {
          const image = card.querySelector(
            '[data-gsap-card-image]'
          );

          if (!image) return;

          const enter = () => {
            gsap.to(image, {
              scale: 1.075,
              duration: 1.15,
              ease: 'power3.out',
            });
          };

          const leave = () => {
            gsap.to(image, {
              scale: 1,
              duration: 1.25,
              ease: 'power3.out',
            });
          };

          card.addEventListener(
            'mouseenter',
            enter
          );

          card.addEventListener(
            'mouseleave',
            leave
          );
        });


      /* ---------------------------------------------
         ROOM CARD ENTRANCE
      --------------------------------------------- */

      gsap.utils
        .toArray('[data-gsap-card]')
        .forEach((card, index) => {
          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 80,
              rotateX: 4,
            },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 1.25,
              delay: index * 0.12,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 82%',
                once: true,
              },
            }
          );
        });


      /* ---------------------------------------------
         FINAL IMAGE
      --------------------------------------------- */

      const finalImage =
        rootRef.current.querySelector(
          '[data-final-image]'
        );

      if (finalImage) {
        gsap.fromTo(
          finalImage,
          {
            scale: 1.12,
            yPercent: -3,
          },
          {
            scale: 1.04,
            yPercent: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: finalImage,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2,
            },
          }
        );
      }

    }, rootRef);

    return () => ctx.revert();
  }, []);

  return rootRef;
}