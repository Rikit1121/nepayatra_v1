'use client'

import * as React from 'react'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark')
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('nepayatra-theme')
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
      if (stored === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      // Default to dark for luxury feel
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initial = prefersDark ? 'dark' : 'dark' // prefer dark aesthetic
      setTheme(initial)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('nepayatra-theme', next)
    if (next === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  if (!mounted) {
    return (
      <div
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full text-white/80',
          className
        )}
      >
        <Moon className="h-4 w-4" />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'relative flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white',
        className
      )}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 transition-transform hover:-rotate-12" />
      )}
    </button>
  )
}
