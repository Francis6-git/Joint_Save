import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const MINUTE_MS = 60_000
const HOUR_MS   = 3_600_000
const DAY_MS    = 86_400_000
const WEEK_MS   = 604_800_000

/**
 * Returns a human-readable relative timestamp.
 *
 * Ranges (all comparisons are against the caller's wall-clock):
 *   < 1 min   → "just now"
 *   < 1 hour  → "X minutes ago"
 *   < 24 hrs  → "X hours ago"
 *   < 7 days  → "X days ago"
 *   ≥ 7 days  → short locale date, e.g. "Jun 10"
 *
 * Future dates (clock skew / Supabase server time) collapse to "just now".
 *
 * Time complexity : O(1)
 * Space complexity: O(1) — single string allocation
 */
export function formatRelativeTime(date: string | Date): string {
  const ts  = typeof date === 'string' ? new Date(date) : date
  if (isNaN(ts.getTime())) return 'Unknown date'

  const diffMs = Date.now() - ts.getTime()
  if (diffMs < MINUTE_MS) return 'just now'
  if (diffMs < HOUR_MS)   return `${Math.floor(diffMs / MINUTE_MS)} minutes ago`
  if (diffMs < DAY_MS)    return `${Math.floor(diffMs / HOUR_MS)} hours ago`
  if (diffMs < WEEK_MS)   return `${Math.floor(diffMs / DAY_MS)} days ago`

  return ts.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Returns the full date-time string shown in the hover tooltip.
 * Format: "Jun 17, 2026, 14:30:00" — locale-independent enough for precision.
 *
 * Time complexity : O(1)
 * Space complexity: O(1)
 */
export function formatExactDateTime(date: string | Date): string {
  const ts = typeof date === 'string' ? new Date(date) : date
  if (isNaN(ts.getTime())) return 'Unknown date'

  return ts.toLocaleString('en-US', {
    month:  'short',
    day:    'numeric',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
