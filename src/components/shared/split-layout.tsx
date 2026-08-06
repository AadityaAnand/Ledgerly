import type { ReactNode } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

interface SplitLayoutProps {
  main: ReactNode
  side: ReactNode
  defaultSideSize?: number
  minSideSize?: number
  maxSideSize?: number
}

/** Two-pane resizable layout — a primary content area next to a secondary
 * panel (an inspector, a PDF preview, a chat sidebar). Wraps
 * react-resizable-panels with Ledgerly's default proportions. */
export function SplitLayout({
  main,
  side,
  defaultSideSize = 34,
  minSideSize = 24,
  maxSideSize = 50,
}: SplitLayoutProps) {
  return (
    <ResizablePanelGroup orientation="horizontal" className="h-full">
      <ResizablePanel defaultSize={100 - defaultSideSize} minSize={100 - maxSideSize}>
        {main}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultSideSize} minSize={minSideSize} maxSize={maxSideSize}>
        {side}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
