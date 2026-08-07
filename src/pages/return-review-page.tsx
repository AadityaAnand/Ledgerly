import { useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { FileQuestion } from 'lucide-react'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EmptyState } from '@/components/shared/empty-state'
import { fadeIn } from '@/lib/animations'
import { getClientById } from '@/mock/clients'
import { getReturnById } from '@/mock/returns'
import { fetchFieldTraces } from '@/services/traceability.service'
import { useTraceabilityStore } from '@/store/traceability-store'
import { useBreadcrumbStore } from '@/store/breadcrumb-store'
import { ReviewWorkspaceHeader } from '@/features/return-review/components/review-workspace-header'
import { ReviewWorkspaceSkeleton } from '@/features/return-review/components/review-workspace-skeleton'
import { FieldListPanel } from '@/features/return-review/components/field-list-panel'
import { DocumentViewerPanel } from '@/features/return-review/components/document-viewer-panel'
import { AIInspectorPanel } from '@/features/return-review/components/ai-inspector-panel'

export function ReturnReviewPage() {
  const { returnId } = useParams({ strict: false }) as { returnId?: string }
  const taxReturn = returnId ? getReturnById(returnId) : undefined
  const client = taxReturn ? getClientById(taxReturn.clientId) : undefined

  const traces = useTraceabilityStore((s) => s.traces)
  const isLoading = useTraceabilityStore((s) => s.isLoading)
  const selectedFieldId = useTraceabilityStore((s) => s.selectedFieldId)
  const selectField = useTraceabilityStore((s) => s.selectField)
  const hoverField = useTraceabilityStore((s) => s.hoverField)
  const initialize = useTraceabilityStore((s) => s.initialize)
  const setLoading = useTraceabilityStore((s) => s.setLoading)

  const setTrailingLabel = useBreadcrumbStore((s) => s.setTrailingLabel)

  useEffect(() => {
    if (!client) return
    setTrailingLabel(client.name)
    return () => setTrailingLabel(null)
  }, [client, setTrailingLabel])

  useEffect(() => {
    if (!returnId) return
    setLoading(true)
    let cancelled = false
    fetchFieldTraces(returnId).then((data) => {
      if (!cancelled) initialize(data)
    })
    return () => {
      cancelled = true
    }
  }, [returnId, initialize, setLoading])

  if (!taxReturn || !client) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <EmptyState
          icon={FileQuestion}
          title="Return not found"
          description="This return doesn’t exist in this preview build."
        />
      </div>
    )
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex h-full flex-col">
        <ReviewWorkspaceHeader client={client} taxReturn={taxReturn} />
        <div className="min-h-0 flex-1">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="h-full"
              >
                <ReviewWorkspaceSkeleton />
              </motion.div>
            ) : traces.length === 0 ? (
              <motion.div
                key="empty"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="h-full"
              >
                <EmptyState
                  icon={FileQuestion}
                  title="No traceability available"
                  description="This return doesn’t have field-level traceability data in this preview build."
                  className="h-full"
                />
              </motion.div>
            ) : (
              <motion.div key="ready" variants={fadeIn} initial="hidden" animate="visible" className="h-full">
                <ResizablePanelGroup orientation="horizontal" className="h-full">
                  <ResizablePanel defaultSize="34" minSize="24">
                    <ScrollArea className="h-full">
                      <FieldListPanel
                        traces={traces}
                        selectedFieldId={selectedFieldId}
                        onSelect={selectField}
                        onHoverChange={hoverField}
                      />
                    </ScrollArea>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize="40" minSize="28">
                    <DocumentViewerPanel />
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize="26" minSize="20" maxSize="36">
                    <AIInspectorPanel />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  )
}
