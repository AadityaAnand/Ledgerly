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
      {/* react-resizable-panels reads bare numbers as pixels — sizes must be
       * passed as strings to be treated as percentages. */}
      <ResizablePanel defaultSize={String(100 - defaultSideSize)} minSize={String(100 - maxSideSize)}>
        {main}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={String(defaultSideSize)}
        minSize={String(minSideSize)}
        maxSize={String(maxSideSize)}
      >
        {side}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
