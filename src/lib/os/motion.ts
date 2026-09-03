/**
 * Shared framer-motion presets for the OS. One place for timing/easing so
 * every redesigned surface moves consistently (150–350ms, spring for
 * anything that should feel physical, a plain ease for anything that
 * shouldn't draw attention to itself). Plain objects, not components —
 * import and spread into a <motion.div>'s props.
 */

export const springy = { type: "spring" as const, stiffness: 400, damping: 30 };
export const springySoft = { type: "spring" as const, stiffness: 300, damping: 26 };

export const fadeInUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.18 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: springySoft,
};

/** Stagger a list's children — pass to the parent's `variants`/`initial`/`animate`. */
export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.04 } },
};
export const staggerItem = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const } },
};

/** Bottom sheet slide — physical, slightly overshooting spring. */
export const sheetSlideUp = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "100%" },
  transition: springy,
};
