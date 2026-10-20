import { useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import Reveal from './AureliaReveal';
import LuxuryLink from './AureliaLuxuryLink';
import styles from '../../pages/AureliaHotelPage.module.css';

export default function CinematicStory({
  id,
  image,
  eyebrow,
  title,
  text,
  side = 'left',
  to = '/hotels/aurelia-grand-hotel/explore',
}) {
  const ref = useRef(null);

  const {
    scrollYProgress,
  } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.16, 1.04, 1.12]
  );

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ['-4%', '4%']
  );

  const imageRotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.35, 0, -0.35]
  );

  const contentY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [65, 0, -45]
  );

  return (
    <section
      id={id}
      ref={ref}
      className={`${styles.cinematic} ${
        side === 'right'
          ? styles.cinematicRight
          : ''
      }`}
    >
      <motion.div
        className={styles.cinematicImage}
        style={{
          backgroundImage: `url("${image}")`,
          scale: imageScale,
          y: imageY,
          rotate: imageRotate,
        }}
      />

      <div className={styles.cinematicOverlay} />

      <div className={styles.cinematicVignette} />

      <motion.div
        className={styles.cinematicContent}
        style={{
          y: contentY,
        }}
      >
        <Reveal>
          <span className={styles.cinematicEyebrow}>
            {eyebrow}
          </span>

          <h2>{title}</h2>

          <p>{text}</p>

          <LuxuryLink
            to={to}
            light
          >
            Explore
          </LuxuryLink>
        </Reveal>
      </motion.div>

      <div className={styles.cinematicBottom}>
        <span>AURELIA GRAND HOTEL</span>

        <motion.div
          animate={{
            y: [0, 6, 0],
            opacity: [0.45, 1, 0.45],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <ArrowDown
            size={16}
            strokeWidth={1}
          />
        </motion.div>
      </div>
    </section>
  );
}