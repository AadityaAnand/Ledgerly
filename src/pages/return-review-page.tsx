import { useEffect } from 'react'
import { useParams, useSearch } from '@tanstack/react-router'
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
import { useNavigationStore } from '@/store/navigation-store'
import { ReviewWorkspaceHeader } from '@/features/return-review/components/review-workspace-header'
import { ReviewWorkspaceSkeleton } from '@/features/return-review/components/review-workspace-skeleton'
import { FieldListPanel } from '@/features/return-review/components/field-list-panel'
import { DocumentViewerPanel } from '@/features/return-review/components/document-viewer-panel'
import { AIInspectorPanel } from '@/features/return-review/components/ai-inspector-panel'
import { ReturnWorkspaceNav } from '@/features/return-workspace/components/return-workspace-nav'
import { getReturnIssues, getReturnAIFindings } from '@/features/return-workspace/lib/return-workspace-data'
import type { TraceCategory } from '@/types'

export function ReturnReviewPage() {
  const { returnId } = useParams({ strict: false }) as { returnId?: string }
  const search = useSearch({ strict: false }) as { field?: string; category?: string }
  const taxReturn = returnId ? getReturnById(returnId) : undefined
  const client = taxReturn ? getClientById(taxReturn.clientId) : undefined

  const traces = useTraceabilityStore((s) => s.traces)
  const isLoading = useTraceabilityStore((s) => s.isLoading)
  const selectedFieldId = useTraceabilityStore((s) => s.selectedFieldId)
  const selectField = useTraceabilityStore((s) => s.selectField)
  const hoverField = useTraceabilityStore((s) => s.hoverField)
  const initialize = useTraceabilityStore((s) => s.initialize)
  const setLoading = useTraceabilityStore((s) => s.setLoading)

  const visit = useNavigationStore((s) => s.visit)

  useEffect(() => {
    if (!client || !taxReturn) return
    visit(
      { type: 'return', id: taxReturn.id, label: client.name, href: `/returns/${taxReturn.id}` },
      { returnId: taxReturn.id, clientId: client.id, status: taxReturn.status }
    )
    // visit is a stable zustand action reference; only re-run when the return itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxReturn?.id, client?.id])

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

  // Deep link support: `?field=` selects a specific field on arrival (from
  // Return Search, the Overview, or the Issues/AI Findings views).
  useEffect(() => {
    if (search.field && traces.some((t) => t.id === search.field)) {
      selectField(search.field)
    }
    // Only re-run when the target field or dataset identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.field, traces.length])

  const focusCategory = (search.category as TraceCategory | undefined) ?? traces.find((t) => t.id === search.field)?.category ?? null

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
        <ReturnWorkspaceNav
          returnId={taxReturn.id}
          issuesCount={getReturnIssues(taxReturn.id).length}
          aiFindingsCount={getReturnAIFindings(taxReturn.id).length}
        />
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
                        focusCategory={focusCategory}
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
