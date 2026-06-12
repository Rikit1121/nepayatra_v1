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
