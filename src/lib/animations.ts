import type { Transition, Variants } from 'framer-motion'

/**
 * Shared motion primitives. Components should import these instead of
 * hand-rolling transition/variant objects so every animation in the product
 * shares the same timing feel.
 */

export const transitions = {
  fast: { duration: 0.12, ease: [0.4, 0, 0.2, 1] } satisfies Transition,
  base: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } satisfies Transition,
  slow: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } satisfies Transition,
  spring: { type: 'spring', stiffness: 400, damping: 32 } satisfies Transition,
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.base },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: transitions.base },
}

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: transitions.slow },
}

/** Wrap a list container with this and each item with `staggerItem`. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
}

/** Subtle press/hover feedback for interactive elements. */
export const pressable = {
  whileHover: { scale: 1.015 },
  whileTap: { scale: 0.98 },
  transition: transitions.fast,
}

export const iconPressable = {
  whileHover: { scale: 1.06 },
  whileTap: { scale: 0.94 },
  transition: transitions.fast,
}
