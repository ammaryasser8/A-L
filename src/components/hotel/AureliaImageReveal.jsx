import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import styles from '../../pages/AureliaHotelPage.module.css';

export default function ImageReveal({
  image,
  className = '',
  position = 'center',
}) {
  const ref = useRef(null);

  const inView = useInView(ref, {
    once: true,
    amount: 0.12,
  });

  return (
    <div
      ref={ref}
      className={`${styles.imageReveal} ${className}`}
    >
      <motion.div
        className={styles.imageRevealInner}
        style={{
          backgroundImage: `url("${image}")`,
          backgroundPosition: position,
        }}
        initial={{
          scale: 1.18,
          opacity: 0,
          filter: 'blur(5px)',
        }}
        animate={
          inView
            ? {
                scale: 1,
                opacity: 1,
                filter: 'blur(0px)',
              }
            : {}
        }
        transition={{
          duration: 1.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      <motion.div
        className={styles.imageRevealGlow}
        initial={{
          opacity: 0,
        }}
        animate={
          inView
            ? {
                opacity: 1,
              }
            : {}
        }
        transition={{
          duration: 1.4,
          delay: 0.25,
        }}
      />

      <motion.div
        className={styles.imageRevealShine}
        initial={{
          x: '-120%',
          opacity: 0,
        }}
        animate={
          inView
            ? {
                x: '120%',
                opacity: [0, 0.35, 0],
              }
            : {}
        }
        transition={{
          duration: 1.8,
          delay: 0.35,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}