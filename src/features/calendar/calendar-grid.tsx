'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PartyPopper,
  Building2,
  Calendar as CalendarIcon,
  Compass,
  ArrowRight,
  Info,
  Flame,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  getMonthCalendarGrid,
  GREGORIAN_MONTHS,
  NEPALI_MONTHS,
  toDevanagariDigits,
  type CalendarDayItem,
} from '@/lib/calendar/nepali-date'
import { getSeasonForMonth } from '@/lib/calendar/seasons'
import { atlasCardPlanner } from '@/lib/design-system'
import { cn } from '@/lib/utils'
import type { CalendarEvent } from '@/lib/supabase/types'

interface CalendarGridProps {
  initialYear?: number
  initialMonth?: number
  events?: CalendarEvent[]
  className?: string
  showMonthLink?: boolean
}

const WEEKDAYS = [
  { en: 'Sun', np: 'आइत', isWeekend: false },
  { en: 'Mon', np: 'सोम', isWeekend: false },
  { en: 'Tue', np: 'मंगल', isWeekend: false },
  { en: 'Wed', np: 'बुध', isWeekend: false },
  { en: 'Thu', np: 'बिही', isWeekend: false },
  { en: 'Fri', np: 'शुक्र', isWeekend: false },
  { en: 'Sat', np: 'शनि', isWeekend: true }, // Nepal official weekly public holiday
]

export function CalendarGrid({
  initialYear = 2026,
  initialMonth = 10,
  events = [],
  className,
  showMonthLink = true,
}: CalendarGridProps) {
  const [year, setYear] = React.useState(initialYear)
  const [month, setMonth] = React.useState(initialMonth) // 1..12
  const [systemMode, setSystemMode] = React.useState<'ad' | 'bs'>('ad')
  const [selectedDay, setSelectedDay] = React.useState<CalendarDayItem | null>(null)

  const days = React.useMemo(() => {
    return getMonthCalendarGrid(year, month)
  }, [year, month])

  const currentMonthMeta = GREGORIAN_MONTHS[month - 1] ?? GREGORIAN_MONTHS[0]
  const seasonInfo = React.useMemo(() => getSeasonForMonth(month), [month])

  // Determine BS months spanned in this Gregorian month
  const bsMonthSummary = React.useMemo(() => {
    const currentDays = days.filter((d) => d.isCurrentMonth)
    if (currentDays.length === 0) return ''
    const firstBs = currentDays[0].bs
    const lastBs = currentDays[currentDays.length - 1].bs

    if (firstBs.month === lastBs.month) {
      return `${firstBs.monthNameNp} ${toDevanagariDigits(firstBs.year)} (${firstBs.monthNameEn} ${firstBs.year})`
    }
    return `${firstBs.monthNameNp} – ${lastBs.monthNameNp} ${toDevanagariDigits(firstBs.year)} (${firstBs.monthNameEn} – ${lastBs.monthNameEn} ${firstBs.year})`
  }, [days])

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
    setSelectedDay(null)
  }

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
    setSelectedDay(null)
  }

  const jumpToToday = () => {
    const now = new Date()
    setYear(now.getFullYear())
    setMonth(now.getMonth() + 1)
    setSelectedDay(null)
  }

  // Find discrete events matching a specific date string (exclude multi-month broad travel season spans from cell overcrowding)
  const getEventsForDate = (dateStr: string): CalendarEvent[] => {
    return events
      .filter((e) => e.event_type !== 'travel_season')
      .filter((e) => {
        if (e.start_date_ad === dateStr || e.end_date_ad === dateStr) return true
        if (e.start_date_ad <= dateStr && e.end_date_ad >= dateStr) return true
        return false
      })
  }

  const selectedDayEvents = selectedDay ? getEventsForDate(selectedDay.dateAd) : []

  return (
    <div className={cn('space-y-4', className)}>
      {/* ── HEADER CONTROLS & AD/BS SYSTEM TOGGLE ── */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-card p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/30 pb-3.5">
          {/* Primary & Secondary Month Titles according to System Mode */}
          <div>
            {systemMode === 'ad' ? (
              <>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {currentMonthMeta.name} {year}
                  </h2>
                  <Badge variant="outline" className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    AD View
                  </Badge>
                  {showMonthLink && (
                    <Button asChild size="sm" variant="ghost" className="h-7 text-xs text-[hsl(var(--atlas-blue))]">
                      <Link href={`/calendar/${year}/${currentMonthMeta.slug}`}>
                        Guide →
                      </Link>
                    </Button>
                  )}
                </div>
                <p className="mt-1 text-xs font-semibold text-[hsl(var(--atlas-saffron))]">
                  Bikram Sambat: {bsMonthSummary}
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {bsMonthSummary}
                  </h2>
                  <Badge variant="outline" className="text-[10px] font-semibold tracking-wider text-[hsl(var(--atlas-saffron))] uppercase">
                    BS View
                  </Badge>
                  {showMonthLink && (
                    <Button asChild size="sm" variant="ghost" className="h-7 text-xs text-[hsl(var(--atlas-blue))]">
                      <Link href={`/calendar/${year}/${currentMonthMeta.slug}`}>
                        Guide →
                      </Link>
                    </Button>
                  )}
                </div>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  Gregorian Equivalent: <span className="font-semibold text-foreground">{currentMonthMeta.name} {year}</span>
                </p>
              </>
            )}
          </div>

          {/* AD ↔ BS Selector & Today Button */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Mode Switcher */}
            <div className="flex rounded-lg border border-border/60 bg-muted/30 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setSystemMode('ad')}
                className={cn(
                  'rounded-md px-3 py-1 font-semibold transition-all',
                  systemMode === 'ad'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                AD (Gregorian)
              </button>
              <button
                type="button"
                onClick={() => setSystemMode('bs')}
                className={cn(
                  'rounded-md px-3 py-1 font-semibold transition-all',
                  systemMode === 'bs'
                    ? 'bg-[hsl(var(--atlas-saffron))] text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                BS (विक्रम संवत्)
              </button>
            </div>

            <Button size="sm" variant="outline" onClick={jumpToToday} className="h-8 text-xs font-semibold">
              Today
            </Button>
          </div>
        </div>

        {/* Month Stepper & Seasonal Indicator Banner */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Season:</span>
            <Badge
              variant="secondary"
              className={cn(
                'text-[11px] font-semibold gap-1',
                seasonInfo.trekkingCondition === 'Optimal'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  : 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
              )}
            >
              <Sparkles className="h-3 w-3" /> {seasonInfo.name} ({seasonInfo.trekkingCondition} Trekking)
            </Badge>
          </div>

          {/* Stepper */}
          <div className="flex items-center self-end sm:self-auto rounded-lg border border-border/50 bg-muted/20">
            <Button
              size="icon"
              variant="ghost"
              onClick={prevMonth}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2.5 font-mono text-xs font-bold text-muted-foreground">
              {String(month).padStart(2, '0')} / {year}
            </span>
            <Button
              size="icon"
              variant="ghost"
              onClick={nextMonth}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ── CALENDAR GRID ── */}
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xs">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-border/40 bg-muted/30 text-center text-xs font-semibold">
          {WEEKDAYS.map((wd) => (
            <div
              key={wd.en}
              className={cn(
                'py-2.5 px-1',
                wd.isWeekend ? 'text-rose-600 dark:text-rose-400 bg-rose-500/[0.04]' : 'text-muted-foreground'
              )}
            >
              <span className="block font-display">{wd.en}</span>
              <span className="block text-[10px] font-normal opacity-70">{wd.np}</span>
            </div>
          ))}
        </div>

        {/* Day slots */}
        <div className="grid grid-cols-7 divide-x divide-y divide-border/30 text-xs">
          {days.map((item, idx) => {
            const dayEvents = getEventsForDate(item.dateAd)
            const hasHoliday = dayEvents.some((e) => e.is_public_holiday)
            const hasFestival = dayEvents.some((e) => e.event_type === 'festival' || e.event_type === 'cultural_event')
            const isSaturday = item.dayOfWeek === 6
            const isSelected = selectedDay?.dateAd === item.dateAd

            // Primary vs Secondary numbers depending on systemMode
            const primaryNumber = systemMode === 'ad' ? item.dayAd : toDevanagariDigits(item.bs.day)
            const secondaryPillText = systemMode === 'ad' ? toDevanagariDigits(item.bs.day) : String(item.dayAd)

            return (
              <button
                key={`${item.dateAd}-${idx}`}
                type="button"
                onClick={() => setSelectedDay(item)}
                className={cn(
                  'group relative min-h-[76px] sm:min-h-[92px] p-1.5 sm:p-2 text-left transition-all flex flex-col justify-between',
                  !item.isCurrentMonth && 'bg-muted/15 opacity-40',
                  item.isCurrentMonth && 'hover:bg-accent/40',
                  item.isToday && 'bg-[hsl(var(--atlas-blue))]/[0.05]',
                  isSelected && 'ring-2 ring-inset ring-[hsl(var(--atlas-blue))] bg-[hsl(var(--atlas-blue))]/[0.08]',
                  isSaturday && item.isCurrentMonth && 'bg-rose-500/[0.02]',
                  // Highlight festival/holiday dates cleanly
                  hasFestival && item.isCurrentMonth && 'bg-amber-500/[0.04] border-amber-500/20',
                  hasHoliday && item.isCurrentMonth && 'bg-rose-500/[0.03]'
                )}
              >
                {/* Top: Primary Number (Large) & Secondary Number (Subtle Pill) */}
                <div className="flex items-start justify-between gap-1">
                  <span
                    className={cn(
                      'font-display text-sm sm:text-base font-bold transition-colors',
                      item.isToday
                        ? 'flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--atlas-blue))] text-white text-xs'
                        : isSaturday || hasHoliday
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-foreground'
                    )}
                  >
                    {primaryNumber}
                  </span>

                  {/* Secondary Date Pill */}
                  <span
                    className={cn(
                      'font-mono text-[9px] sm:text-[10px] font-semibold px-1 rounded transition-colors',
                      hasHoliday
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                        : hasFestival
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                        : 'text-muted-foreground bg-muted/60'
                    )}
                    title={
                      systemMode === 'ad'
                        ? `BS: ${item.bs.formattedEn} (${item.bs.formattedNp})`
                        : `AD: ${item.dateAd}`
                    }
                  >
                    {secondaryPillText}
                  </span>
                </div>

                {/* Bottom: Verified Discrete Festival / Holiday Badges */}
                <div className="mt-1 space-y-0.5 overflow-hidden">
                  {dayEvents.slice(0, 1).map((ev) => {
                    const isPubHoliday = ev.is_public_holiday
                    const isFest = ev.event_type === 'festival' || ev.event_type === 'cultural_event'

                    return (
                      <div
                        key={ev.id}
                        className={cn(
                          'truncate rounded px-1 py-0.5 text-[9px] sm:text-[10px] font-medium leading-tight flex items-center gap-1',
                          isPubHoliday
                            ? 'bg-rose-500/15 text-rose-800 dark:text-rose-300 font-semibold border border-rose-500/20'
                            : isFest
                            ? 'bg-amber-500/15 text-amber-900 dark:text-amber-200 font-semibold border border-amber-500/30'
                            : 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
                        )}
                        title={`${ev.title} (${isPubHoliday ? 'Public Holiday' : ev.event_type.replace('_', ' ')})`}
                      >
                        {isFest && <Flame className="h-2.5 w-2.5 shrink-0 text-amber-600 dark:text-amber-400" />}
                        <span className="truncate">
                          {ev.title.replace(/\s*202[0-9]/, '')}
                        </span>
                      </div>
                    )
                  })}

                  {dayEvents.length > 1 && (
                    <span className="block text-[9px] font-medium text-muted-foreground/80 pl-0.5">
                      +{dayEvents.length - 1} more event
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── SELECTED DAY DETAILS DRAWER ── */}
      {selectedDay && (
        <article className={cn(atlasCardPlanner, 'p-4 sm:p-5 bg-card border-[hsl(var(--atlas-blue))]/30 transition-all shadow-xs')}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--atlas-blue))]">
                Selected Date Details
              </p>

              {systemMode === 'ad' ? (
                <>
                  <h3 className="font-display text-xl font-bold text-foreground sm:text-2xl mt-0.5">
                    {selectedDay.dateAd} (AD)
                  </h3>
                  <p className="text-xs font-semibold text-[hsl(var(--atlas-saffron))] mt-0.5">
                    Bikram Sambat: {selectedDay.bs.formattedNp} · {selectedDay.bs.formattedEn}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-display text-xl font-bold text-foreground sm:text-2xl mt-0.5">
                    {selectedDay.bs.formattedNp} · {selectedDay.bs.formattedEn} (BS)
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">
                    Gregorian (AD): <span className="font-semibold text-foreground">{selectedDay.dateAd}</span>
                  </p>
                </>
              )}
            </div>

            <Button asChild size="sm" className="shadow-xs self-start sm:self-auto">
              <Link href={`/route-planner`}>
                Plan Trip for This Period <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {selectedDayEvents.length > 0 ? (
            <div className="mt-3.5 space-y-2.5">
              {selectedDayEvents.map((ev) => (
                <div key={ev.id} className="rounded-xl border border-border/50 bg-muted/20 p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-sm font-bold text-foreground">
                        {ev.title}
                      </h4>
                      {ev.nepali_title && (
                        <span className="font-display text-xs text-[hsl(var(--atlas-saffron))]">
                          ({ev.nepali_title})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                        {ev.event_type.replace('_', ' ')}
                      </Badge>
                      {ev.is_public_holiday && (
                        <Badge variant="destructive" className="text-[10px] font-bold">
                          Official Public Holiday
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {ev.summary}
                  </p>

                  {ev.travel_impact && (
                    <div className="mt-2 rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 text-[11px] font-medium text-amber-900 dark:text-amber-200">
                      <span className="font-bold">Travel Advisory: </span>
                      {ev.travel_impact}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">
              No major national festival or official public holiday recorded on this date. Regular public transportation and trekking permits operate normally.
            </p>
          )}
        </article>
      )}
    </div>
  )
}
