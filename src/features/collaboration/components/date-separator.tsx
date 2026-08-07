import { formatDate } from '@/utils/format'

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function isYesterday(date: Date) {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(date, yesterday)
}

interface DateSeparatorProps {
  iso: string
}

export function DateSeparator({ iso }: DateSeparatorProps) {
  const date = new Date(iso)
  const label = isSameDay(date, new Date())
    ? 'Today'
    : isYesterday(date)
      ? 'Yesterday'
      : formatDate(iso, { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="flex items-center gap-3 py-2" role="separator" aria-label={label}>
      <div className="bg-border h-px flex-1" />
      <span className="text-foreground-tertiary text-[11px] font-medium tracking-wide uppercase">{label}</span>
      <div className="bg-border h-px flex-1" />
    </div>
  )
}
