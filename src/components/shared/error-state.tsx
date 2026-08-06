import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We couldn’t load this data. Try again in a moment.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn('flex flex-col items-center justify-center rounded-xl px-6 py-16 text-center', className)}
    >
      <div className="bg-danger-subtle flex size-12 items-center justify-center rounded-full">
        <AlertTriangle className="text-danger size-5" aria-hidden="true" />
      </div>
      <h3 className="text-foreground mt-4 text-sm font-semibold">{title}</h3>
      <p className="text-foreground-secondary mt-1.5 max-w-sm text-sm leading-relaxed">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
