import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DocumentPageCanvasProps {
  zoom: number
  children: ReactNode
  className?: string
}

/**
 * The "paper" a facsimile page renders onto. Deliberately styled with fixed
 * light-mode neutrals (not the theme's swapping foreground/background
 * tokens) — a document page should look like paper in both app themes, the
 * same way a real PDF viewer never re-skins the page itself for dark mode.
 */
export const DocumentPageCanvas = forwardRef<HTMLDivElement, DocumentPageCanvasProps>(
  ({ zoom, children, className }, ref) => {
    return (
      <div className="px-6 py-8" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
        <div
          ref={ref}
          className={cn(
            'bg-neutral-0 relative mx-auto w-full max-w-170 rounded-sm text-neutral-900 shadow-lg ring-1 ring-neutral-900/10',
            className
          )}
          style={{ aspectRatio: '8.5 / 11' }}
        >
          {children}
        </div>
      </div>
    )
  }
)
DocumentPageCanvas.displayName = 'DocumentPageCanvas'
