'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'

interface MapErrorBoundaryProps {
  children: React.ReactNode
}

interface MapErrorBoundaryState {
  error: Error | null
}

/** Catches render errors from the MapLibre tree so failures are visible in the UI. */
export class MapErrorBoundary extends React.Component<
  MapErrorBoundaryProps,
  MapErrorBoundaryState
> {
  state: MapErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): MapErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[MapErrorBoundary] map render failed', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full min-h-[420px] w-full flex-col items-center justify-center gap-3 bg-[hsl(var(--atlas-mist))] px-6 text-center">
          <p className="font-display text-lg font-bold text-[hsl(var(--atlas-blue))]">
            Map failed to load
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            {this.state.error.message}
          </p>
          <Button type="button" variant="outline" onClick={() => this.setState({ error: null })}>
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
