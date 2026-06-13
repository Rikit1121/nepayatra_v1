'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { cardHover } from '@/lib/motion'

interface MotionCardProps {
  children: React.ReactNode
  className?: string
}

/** Card lift on hover (6–8px) with reduced-motion fallback. */
export function MotionCard({ children, className }: MotionCardProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn(className)}
      whileHover={cardHover}
      transition={{ type: 'tween' }}
    >
      {children}
    </motion.div>
  )
}
