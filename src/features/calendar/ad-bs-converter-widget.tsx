'use client'

import * as React from 'react'
import { ArrowRightLeft, Calendar as CalendarIcon, Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { adToBs, bsToAd, NEPALI_MONTHS, type BsDateResult, type AdDateResult } from '@/lib/calendar/nepali-date'
import { atlasCardPlanner } from '@/lib/design-system'
import { cn } from '@/lib/utils'

export function AdBsConverterWidget({ className }: { className?: string }) {
  const [mode, setMode] = React.useState<'ad_to_bs' | 'bs_to_ad'>('ad_to_bs')

  // AD -> BS state
  const [inputAdDate, setInputAdDate] = React.useState<string>(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })
  const [bsResult, setBsResult] = React.useState<BsDateResult | null>(null)

  // BS -> AD state
  const [inputBsYear, setInputBsYear] = React.useState<number>(2083)
  const [inputBsMonth, setInputBsMonth] = React.useState<number>(7) // Kartik
  const [inputBsDay, setInputBsDay] = React.useState<number>(1)
  const [adResult, setAdResult] = React.useState<AdDateResult | null>(null)

  const [copied, setCopied] = React.useState(false)

  // Auto-calculate AD -> BS
  React.useEffect(() => {
    if (mode === 'ad_to_bs' && inputAdDate) {
      try {
        const res = adToBs(inputAdDate)
        setBsResult(res)
      } catch {
        setBsResult(null)
      }
    }
  }, [mode, inputAdDate])

  // Auto-calculate BS -> AD
  React.useEffect(() => {
    if (mode === 'bs_to_ad') {
      try {
        const res = bsToAd(Number(inputBsYear), Number(inputBsMonth), Number(inputBsDay))
        setAdResult(res)
      } catch {
        setAdResult(null)
      }
    }
  }, [mode, inputBsYear, inputBsMonth, inputBsDay])

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <article className={cn(atlasCardPlanner, 'bg-card p-5 border-[hsl(var(--atlas-blue))]/25', className)}>
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4 text-[hsl(var(--atlas-blue))]" />
          <h3 className="font-display text-base font-bold text-foreground">
            AD ↔ BS Date Converter
          </h3>
        </div>

        {/* Mode Toggle */}
        <div className="flex rounded-lg border border-border/50 bg-muted/30 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMode('ad_to_bs')}
            className={cn(
              'rounded-md px-2.5 py-1 font-semibold transition-colors',
              mode === 'ad_to_bs'
                ? 'bg-[hsl(var(--atlas-blue))] text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            AD → BS
          </button>
          <button
            type="button"
            onClick={() => setMode('bs_to_ad')}
            className={cn(
              'rounded-md px-2.5 py-1 font-semibold transition-colors',
              mode === 'bs_to_ad'
                ? 'bg-[hsl(var(--atlas-blue))] text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            BS → AD
          </button>
        </div>
      </div>

      <div className="mt-4">
        {mode === 'ad_to_bs' ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Gregorian (AD) Date:
              </label>
              <Input
                type="date"
                value={inputAdDate}
                onChange={(e) => setInputAdDate(e.target.value)}
                className="mt-1 font-mono text-sm"
              />
            </div>

            {bsResult && (
              <div className="rounded-xl border border-[hsl(var(--atlas-saffron))]/30 bg-[hsl(var(--atlas-saffron))]/5 p-3.5">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Bikram Sambat (BS) Equivalent
                </p>
                <div className="mt-1 flex items-baseline justify-between">
                  <div>
                    <p className="font-display text-lg font-bold text-foreground">
                      {bsResult.formattedEn}
                    </p>
                    <p className="text-sm font-semibold text-[hsl(var(--atlas-saffron))]">
                      {bsResult.formattedNp}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyText(`${bsResult.formattedEn} (${bsResult.formattedNp})`)}
                    className="h-8 gap-1 text-xs text-muted-foreground"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground">BS Year</label>
                <Input
                  type="number"
                  min={2000}
                  max={2099}
                  value={inputBsYear}
                  onChange={(e) => setInputBsYear(Number(e.target.value))}
                  className="mt-1 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">BS Month</label>
                <select
                  value={inputBsMonth}
                  onChange={(e) => setInputBsMonth(Number(e.target.value))}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {NEPALI_MONTHS.map((m) => (
                    <option key={m.index} value={m.index}>
                      {m.nameEn} ({m.nameNp})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">BS Day</label>
                <Input
                  type="number"
                  min={1}
                  max={32}
                  value={inputBsDay}
                  onChange={(e) => setInputBsDay(Number(e.target.value))}
                  className="mt-1 font-mono text-xs"
                />
              </div>
            </div>

            {adResult && (
              <div className="rounded-xl border border-[hsl(var(--atlas-blue))]/30 bg-[hsl(var(--atlas-blue))]/5 p-3.5">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Gregorian (AD) Equivalent
                </p>
                <div className="mt-1 flex items-baseline justify-between">
                  <div>
                    <p className="font-display text-lg font-bold text-foreground">
                      {adResult.formattedEn}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {adResult.formatted}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyText(adResult.formattedEn)}
                    className="h-8 gap-1 text-xs text-muted-foreground"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
