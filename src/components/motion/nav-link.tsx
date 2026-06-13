'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { EASE_OUT, DURATION } from '@/lib/motion'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  isActive?: boolean
  className?: string
  onClick?: () => void
}

/** Desktop nav link with animated underline. */
export function NavLink({ href, children, isActive, className, onClick }: NavLinkProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          'relative rounded-md px-3 py-2 text-sm font-medium',
          isActive
            ? 'font-semibold text-[hsl(var(--atlas-blue))]'
            : 'text-muted-foreground hover:text-[hsl(var(--atlas-blue))]',
          className
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        {children}
        {isActive && (
          <span className="absolute bottom-1 left-3 right-3 h-px bg-[hsl(var(--atlas-blue))]" />
        )}
      </Link>
    )
  }

  return (
    <motion.div
      className="inline-flex"
      initial="rest"
      whileHover="hover"
      animate={isActive ? 'active' : 'rest'}
      variants={{ rest: {}, hover: {}, active: {} }}
    >
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          'relative rounded-md px-3 py-2 text-sm font-medium',
          isActive
            ? 'font-semibold text-[hsl(var(--atlas-blue))]'
            : 'text-muted-foreground hover:text-[hsl(var(--atlas-blue))]',
          className
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        {children}
        <motion.span
          className="absolute bottom-1 left-3 right-3 h-px origin-left bg-[hsl(var(--atlas-blue))]"
          variants={{
            rest: { scaleX: 0, opacity: 0 },
            hover: { scaleX: 1, opacity: 1 },
            active: { scaleX: 1, opacity: 1 },
          }}
          transition={{ duration: DURATION.fast, ease: EASE_OUT }}
        />
      </Link>
    </motion.div>
  )
}
