import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-primary">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">We couldn't find that page</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page may have moved, or the link might be wrong. Let's get you back on track.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/destinations">Browse destinations</Link>
        </Button>
      </div>
    </div>
  )
}
