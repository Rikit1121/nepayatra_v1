import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert a human-readable string to a URL-safe slug.
 * Any run of non-alphanumeric characters (spaces, en/em dashes, slashes, etc.)
 * collapses to a single hyphen, so "Raxaul–Birgunj" → "raxaul-birgunj".
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Build a wa.me deep link with an optional pre-filled message. */
export function whatsappLink(number: string, message?: string): string {
  const clean = number.replace(/[^\d]/g, '')
  const base = `https://wa.me/${clean}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

/** Format an INR amount with grouping. */
export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

/** Format an ISO date string (YYYY-MM-DD) to a human-readable short date (e.g. "Oct 15"). */
export function formatShortDate(isoDate: string): string {
  try {
    const parts = isoDate.split('-')
    if (parts.length < 3) return isoDate
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
    if (isNaN(d.getTime())) return isoDate
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return isoDate
  }
}

/** Format a trip date range (e.g. "Oct 15 – Oct 22, 2026"). */
export function formatTripDateRange(startDate?: string | null, endDate?: string | null, days?: number): string {
  if (startDate && endDate) {
    try {
      const sParts = startDate.split('-')
      const eParts = endDate.split('-')
      const s = new Date(Number(sParts[0]), Number(sParts[1]) - 1, Number(sParts[2]))
      const e = new Date(Number(eParts[0]), Number(eParts[1]) - 1, Number(eParts[2]))
      if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
        const sMonth = s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        const eMonth = e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        return `${sMonth} – ${eMonth}`
      }
    } catch {}
  }
  return days ? `${days} Days in Nepal` : 'Nepal Itinerary'
}

