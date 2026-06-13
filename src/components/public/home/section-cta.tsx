import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SectionCtaProps {
  message: string
  buttonLabel: string
  href: string
  className?: string
}

/** Consistent inline conversion card between homepage sections. */
export function SectionCta({ message, buttonLabel, href, className }: SectionCtaProps) {
  return (
    <div
      className={cn(
        'mt-10 flex flex-col gap-4 rounded-xl border border-[hsl(var(--atlas-blue))]/15',
        'bg-[hsl(var(--atlas-blue))]/[0.05] p-6 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6',
        className
      )}
    >
      <p className="font-display text-lg font-semibold leading-snug text-[hsl(var(--atlas-blue))]">
        {message}
      </p>
      <Button
        asChild
        variant="outline"
        className="shrink-0 border-[hsl(var(--atlas-blue))]/30 text-[hsl(var(--atlas-blue))] hover:bg-[hsl(var(--atlas-blue))]/5"
      >
        <Link href={href}>
          {buttonLabel}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
