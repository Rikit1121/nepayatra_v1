'use client'

import { useEffect } from 'react'
import { ErrorState } from '@/components/public/states'

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container py-20">
      <ErrorState
        title="This page didn't load"
        description="A temporary problem stopped us from loading this content. Please try again."
        onRetry={reset}
      />
    </div>
  )
}
