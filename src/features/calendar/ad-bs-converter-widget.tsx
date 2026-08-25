'use client'

import * as React from 'react'
import { ArrowRightLeft, Calendar as CalendarIcon, Check, Copy, Sparkles } from 'lucide-react'
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
    <article className={cn(atlasCardPlanner, 'bg-card p-5 border-[hsl(var(--atlas-blue))]/25 shadow-xs', className)}>
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4 text-[hsl(var(--atlas-blue))]" />
          <h3 className="font-display text-base font-bold text-foreground">
            AD ↔ BS Converter
          </h3>
        </div>

        {/* Mode Toggle */}
        <div className="flex rounded-lg border border-border/50 bg-muted/30 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMode('ad_to_bs')}
            className={cn(
              'rounded-md px-2.5 py-1 font-semibold transition-all',
              mode === 'ad_to_bs'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            AD → BS
          </button>
          <button
            type="button"
            onClick={() => setMode('bs_to_ad')}
            className={cn(
              'rounded-md px-2.5 py-1 font-semibold transition-all',
              mode === 'bs_to_ad'
                ? 'bg-[hsl(var(--atlas-saffron))] text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            BS → AD
          </button>
        </div>
      </div>

      <div className="mt-4">
        {mode === 'ad_to_bs' ? (
          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-foreground">
                Gregorian (AD) Date (Selected Primary):
              </label>
              <Input
                type="date"
                value={inputAdDate}
                onChange={(e) => setInputAdDate(e.target.value)}
                className="mt-1 font-mono text-sm font-semibold h-10 border-primary/40 focus-visible:ring-primary"
              />
            </div>

            {bsResult && (
              <div className="rounded-xl border border-[hsl(var(--atlas-saffron))]/40 bg-[hsl(var(--atlas-saffron))]/[0.07] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--atlas-saffron))]">
                    Bikram Sambat (BS) Equivalent
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyText(`${bsResult.formattedNp} (${bsResult.formattedEn})`)}
                    className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>

                <div className="mt-2">
                  <p className="font-display text-2xl font-bold tracking-tight text-[hsl(var(--atlas-saffron))]">
                    {bsResult.formattedNp}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground/90">
                    {bsResult.formattedEn}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-foreground">
                Bikram Sambat (BS) Date (Selected Primary):
              </label>
              <div className="mt-1 grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-muted-foreground block mb-0.5">Year (वर्ष)</span>
                  <Input
                    type="number"
                    min={2000}
                    max={2099}
                    value={inputBsYear}
                    onChange={(e) => setInputBsYear(Number(e.target.value))}
                    className="font-mono text-xs h-9 border-[hsl(var(--atlas-saffron))]/40"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground block mb-0.5">Month (महिना)</span>
                  <select
                    value={inputBsMonth}
                    onChange={(e) => setInputBsMonth(Number(e.target.value))}
                    className="flex h-9 w-full rounded-md border border-[hsl(var(--atlas-saffron))]/40 bg-background px-2 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {NEPALI_MONTHS.map((m) => (
                      <option key={m.index} value={m.index}>
                        {m.nameNp} ({m.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground block mb-0.5">Day (गते)</span>
                  <Input
                    type="number"
                    min={1}
                    max={32}
                    value={inputBsDay}
                    onChange={(e) => setInputBsDay(Number(e.target.value))}
                    className="font-mono text-xs h-9 border-[hsl(var(--atlas-saffron))]/40"
                  />
                </div>
              </div>
            </div>

            {adResult && (
              <div className="rounded-xl border border-[hsl(var(--atlas-blue))]/40 bg-[hsl(var(--atlas-blue))]/[0.07] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--atlas-blue))]">
                    Gregorian (AD) Equivalent
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyText(adResult.formattedEn)}
                    className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>

                <div className="mt-2">
                  <p className="font-display text-2xl font-bold tracking-tight text-foreground">
                    {adResult.formattedEn}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    ISO Date: {adResult.formatted}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
