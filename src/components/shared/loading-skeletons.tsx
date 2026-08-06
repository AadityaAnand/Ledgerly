import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/** A block of skeleton text lines — sized for card titles/descriptions. */
export function SkeletonText({ lines = 2, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-3.5', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  )
}

/** Loading placeholder shaped like MetricCard/InfoCard. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-surface-raised border-border rounded-xl border p-5', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="size-4 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-7 w-20" />
    </div>
  )
}

/** Loading placeholder for a list of rows (tasks, notifications, messages). */
export function SkeletonList({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-3.5 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
