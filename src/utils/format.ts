import { formatDistanceToNowStrict, parseISO } from 'date-fns'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Parses with date-fns' `parseISO` rather than `new Date(iso)` — a
 * date-only string like "2026-09-15" is UTC midnight under the native
 * parser, which renders as the day before in any timezone behind UTC.
 * `parseISO` treats it as local midnight instead, so calendar dates
 * (due dates, etc.) display correctly regardless of viewer timezone.
 */
export function formatDate(iso: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(
    'en-US',
    options ?? { month: 'short', day: 'numeric', year: 'numeric' }
  ).format(parseISO(iso))
}

export function formatRelativeTime(iso: string): string {
  return `${formatDistanceToNowStrict(parseISO(iso))} ago`
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unitIndex]}`
}

export function formatInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return `${first}${last}`.toUpperCase()
}
