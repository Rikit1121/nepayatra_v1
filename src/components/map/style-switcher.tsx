'use client'

import * as React from 'react'
import { MAP_STYLES, type MapStyleId } from '@/lib/map'
import { Box } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StyleSwitcherProps {
  currentStyle: MapStyleId
  onSelectStyle: (styleId: MapStyleId) => void
  is3D: boolean
  onToggle3D: () => void
  className?: string
}

export function StyleSwitcher({
  currentStyle,
  onSelectStyle,
  is3D,
  onToggle3D,
  className,
}: StyleSwitcherProps) {
  const styles: MapStyleId[] = ['travel', 'topo', 'satellite']

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-xl border border-black/10 bg-white/90 p-1 shadow-lg backdrop-blur-md dark:border-white/15 dark:bg-zinc-900/90',
        className
      )}
      role="toolbar"
      aria-label="Map style and perspective controls"
    >
      <div className="flex items-center gap-0.5">
        {styles.map((styleKey) => {
          const item = MAP_STYLES[styleKey]
          const isActive = currentStyle === styleKey
          return (
            <button
              key={styleKey}
              type="button"
              onClick={() => onSelectStyle(styleKey)}
              title={item.description}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150 select-none',
                isActive
                  ? 'bg-[#1e3a5f] text-white shadow-sm dark:bg-amber-500 dark:text-zinc-950 font-semibold'
                  : 'text-zinc-600 hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white'
              )}
            >
              <span className="text-sm leading-none">{item.icon}</span>
              <span className="hidden sm:inline">{item.name}</span>
            </button>
          )
        })}
      </div>

      <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700" />

      {/* 3D Perspective Tilt Button */}
      <button
        type="button"
        onClick={onToggle3D}
        title={is3D ? 'Reset to flat 2D top-down view' : 'Tilt camera for 3D Himalayan perspective'}
        className={cn(
          'flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150 select-none',
          is3D
            ? 'bg-amber-600 text-white shadow-sm font-semibold'
            : 'text-zinc-600 hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white'
        )}
      >
        <Box className={cn('h-3.5 w-3.5', is3D && 'animate-pulse')} />
        <span className="hidden sm:inline">{is3D ? '3D Active' : '3D View'}</span>
      </button>
    </div>
  )
}
