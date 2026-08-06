import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

/** Consistent max-width + gutter wrapper for page content. Every route
 * should render its content through this. */
export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={cn('container-page flex flex-col gap-8 px-8 py-8', className)}>{children}</div>
}
