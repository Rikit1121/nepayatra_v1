'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { staggerContainer, staggerItem, instantTransition } from '@/lib/motion'

interface StaggerGridProps {
  children: React.ReactNode
  className?: string
}

/** Stagger-animates direct children into view. */
export function StaggerGrid({ children, className }: StaggerGridProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08, margin: '-40px' }}
      variants={reduce ? undefined : staggerContainer}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={cn(className)}
      variants={reduce ? undefined : staggerItem}
      transition={reduce ? instantTransition : undefined}
    >
      {children}
    </motion.div>
  )
}
