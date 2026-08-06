import { cn } from '@/lib/utils'

const markSizes = {
  sm: 22,
  md: 28,
  lg: 34,
} as const

interface LogoProps {
  size?: keyof typeof markSizes
  /** Renders only the geometric mark, without the "Ledgerly" wordmark. */
  markOnly?: boolean
  className?: string
}

/** Ledgerly wordmark: a minimal geometric mark (an abstracted ledger page
 * with a checkmark) paired with the product name. Used in the sidebar and
 * anywhere else the brand needs to appear. */
export function Logo({ size = 'md', markOnly = false, className }: LogoProps) {
  const px = markSizes[size]

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg
        width={px}
        height={px}
        viewBox="0 0 32 32"
        fill="none"
        role="img"
        aria-label="Ledgerly"
        className="shrink-0"
      >
        <rect width="32" height="32" rx="9" className="fill-primary" />
        <path
          d="M11 22V11.6C11 10.7163 11.7163 10 12.6 10H15.2C18 10 19.8 11.7 19.8 14.2C19.8 16.6 17.9 18.3 15.3 18.4H13.4V22C13.4 22.5523 12.9523 23 12.4 23H12C11.4477 23 11 22.5523 11 22Z"
          className="fill-primary-foreground"
        />
        <path
          d="M21.5 14.5H24.5"
          stroke="currentColor"
          className="text-primary-foreground/90"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M21.5 18H23.3"
          stroke="currentColor"
          className="text-primary-foreground/60"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      {!markOnly && (
        <span className="text-foreground text-[1.0625rem] leading-none font-semibold tracking-tight">
          Ledgerly
        </span>
      )}
    </div>
  )
}
