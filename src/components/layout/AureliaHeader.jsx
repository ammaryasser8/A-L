import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

import styles from './AureliaHeader.module.css';

export default function AureliaHeader({ onMenuClick }) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSolid(window.scrollY > 70);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  function handleBookNow() {
    scrollToSection('booking');
  }

  return (
    <header
      className={`${styles.header} ${
        solid ? styles.solid : ''
      }`}
    >
      <div className={styles.navRow}>

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className={styles.leftSide}>

          {/* LOGO */}
          <Link
            to="/hotels/aurelia-grand-hotel"
            className={styles.logo}
            aria-label="Aurelia Grand Hotel"
          >
            <motion.img
              src="/images/aurelia/logo.png"
              alt="Aurelia Grand Hotel"
              className={styles.logoImage}
              whileHover={{
                scale: 1.04,
              }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </Link>


          {/* GOLD DIVIDER */}
          <span className={styles.divider} />


          {/* MENU ICON ONLY */}
          <motion.button
            type="button"
            className={styles.menuBtn}
            onClick={onMenuClick}
            aria-label="Open menu"
            whileTap={{
              scale: 0.9,
            }}
            whileHover={{
              scale: 1.05,
            }}
          >
            <Menu
              size={23}
              strokeWidth={1.25}
            />
          </motion.button>

        </div>


        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className={styles.rightSide}>

          <nav className={styles.mainNav}>

            {/* HOME */}
            <Link
              to="/hotels/aurelia-grand-hotel"
              className={styles.navItem}
            >
              Home
            </Link>


            {/* EXPLORE */}
            <Link
              to="/hotels/aurelia-grand-hotel/explore"
              className={styles.navItem}
            >
              Explore
            </Link>


            {/* ABOUT */}
            <button
              type="button"
              className={styles.navItem}
              onClick={() => scrollToSection('about')}
            >
              About
            </button>

          </nav>


          {/* BOOK NOW */}
          <motion.button
            type="button"
            className={styles.bookBtn}
            onClick={handleBookNow}
            whileHover="hover"
            whileTap={{
              scale: 0.97,
            }}
          >
            <span className={styles.bookText}>
              Book now
            </span>

            <motion.span
              className={styles.bookIcon}
              variants={{
                hover: {
                  x: 4,
                  y: -4,
                },
              }}
              transition={{
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ArrowUpRight
                size={15}
                strokeWidth={1.3}
              />
            </motion.span>
          </motion.button>

        </div>

      </div>
    </header>
  );
}