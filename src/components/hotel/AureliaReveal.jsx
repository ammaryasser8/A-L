import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

export default function Reveal({
  children,
  delay = 0,
  className = '',
  amount = 0.2,
}) {
  const ref = useRef(null);

  const inView = useInView(ref, {
    once: true,
    amount,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: 45,
      }}
      animate={
        inView
          ? {
              opacity: 1,
              y: 0,
            }
          : {}
      }
      transition={{
        duration: 1.05,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}