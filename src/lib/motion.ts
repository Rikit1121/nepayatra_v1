import type { Transition, Variants } from 'framer-motion'

/** Premium ease — smooth deceleration, no bounce. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const DURATION = {
  fast: 0.2,
  base: 0.35,
  slow: 0.5,
} as const

export const VIEWPORT = {
  once: true,
  amount: 0.15,
  margin: '-60px',
} as const

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
}

export const cardHover = {
  y: -7,
  transition: { duration: DURATION.fast, ease: EASE_OUT },
}

export const buttonHover = {
  scale: 1.02,
  transition: { duration: DURATION.fast, ease: EASE_OUT },
}

export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.15, ease: EASE_OUT },
}

export const imageHover = {
  scale: 1.05,
  transition: { duration: DURATION.slow, ease: EASE_OUT },
}

export const instantTransition: Transition = { duration: 0 }
