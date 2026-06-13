'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeInUp, VIEWPORT, instantTransition } from '@/lib/motion'

interface FadeInViewProps {
  children: React.ReactNode
  className?: string
}

/** Fades content in when entering the viewport. */
export function FadeInView({ children, className }: FadeInViewProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={cn(className)}
      initial={reduce ? false : 'hidden'}
      whileInView={reduce ? undefined : 'visible'}
      viewport={VIEWPORT}
      variants={reduce ? undefined : fadeInUp}
      transition={reduce ? instantTransition : undefined}
    >
      {children}
    </motion.div>
  )
}
