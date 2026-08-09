import {
  Calculator,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  FileWarning,
  Minus,
  Plus,
  UploadCloud,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { getSourceDocumentById } from '@/mock'
import { EmptyState } from '@/components/shared/empty-state'
import { IconButton } from '@/components/shared/icon-button'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTraceabilityStore } from '@/store/traceability-store'
import { fadeIn } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { DocumentFacsimile } from './document-facsimile'
import { DocumentThumbnails } from './document-thumbnails'

export function DocumentViewerPanel() {
  const traces = useTraceabilityStore((s) => s.traces)
  const activeFieldId = useTraceabilityStore((s) => s.activeFieldId)
  const zoom = useTraceabilityStore((s) => s.zoomLevel)
  const activePageNumber = useTraceabilityStore((s) => s.activePageNumber)
  const zoomIn = useTraceabilityStore((s) => s.zoomIn)
  const zoomOut = useTraceabilityStore((s) => s.zoomOut)
  const resetZoom = useTraceabilityStore((s) => s.resetZoom)
  const setActivePage = useTraceabilityStore((s) => s.setActivePage)

  const activeTrace = traces.find((t) => t.id === activeFieldId)
  const sourceDocument = activeTrace?.sourceDocumentId
    ? getSourceDocumentById(activeTrace.sourceDocumentId)
    : undefined

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTrace?.id ?? 'empty'}
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="h-full"
      >
        {!activeTrace ? (
          <EmptyState
            icon={FileSearch}
            title="Select a field to trace its source"
            description="Choose any line item from the return to see exactly where its value came from."
            className="h-full"
          />
        ) : activeTrace.isCalculated ? (
          <EmptyState
            icon={Calculator}
            title="This value is calculated"
            description={
              activeTrace.calculationFormula
                ? `Derived from other fields on this return: ${activeTrace.calculationFormula}`
                : 'Derived from other fields on this return rather than a single source document.'
            }
            className="h-full"
          />
        ) : !sourceDocument ? (
          <EmptyState
            icon={FileWarning}
            title="Awaiting source document"
            description="No document has been uploaded for this field yet — Ledgerly can't trace it until one is on file."
            action={
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => toast('Document requests aren’t available yet.')}
              >
                <UploadCloud className="size-4" aria-hidden="true" />
                Request from client
              </Button>
            }
            className="h-full"
          />
        ) : (
          <div className="flex h-full flex-col">
            <div className="border-border flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3.5">
              <div className="min-w-0">
                <p className="text-foreground truncate text-sm font-semibold">{sourceDocument.type}</p>
                <p className="text-foreground-tertiary truncate text-xs">{sourceDocument.issuer}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {sourceDocument.pageCount > 1 && (
                  <>
                    <div className="flex items-center gap-0.5">
                      <IconButton
                        label="Previous page"
                        icon={<ChevronLeft className="size-4" />}
                        disabled={activePageNumber <= 1}
                        onClick={() => setActivePage(Math.max(1, activePageNumber - 1))}
                      />
                      <span className="text-foreground-tertiary w-16 text-center text-xs tabular-nums">
                        Page {activePageNumber} / {sourceDocument.pageCount}
                      </span>
                      <IconButton
                        label="Next page"
                        icon={<ChevronRight className="size-4" />}
                        disabled={activePageNumber >= sourceDocument.pageCount}
                        onClick={() =>
                          setActivePage(Math.min(sourceDocument.pageCount, activePageNumber + 1))
                        }
                      />
                    </div>
                    <div className="bg-border mx-1 h-5 w-px" aria-hidden="true" />
                  </>
                )}
                <IconButton label="Zoom out" icon={<Minus className="size-4" />} onClick={zoomOut} />
                <button
                  type="button"
                  onClick={resetZoom}
                  className={cn(
                    'text-foreground-tertiary hover:bg-surface-hover hover:text-foreground-secondary',
                    'w-12 rounded-md py-1.5 text-center text-xs tabular-nums transition-colors focus-visible:-outline-offset-2'
                  )}
                >
                  {Math.round(zoom * 100)}%
                </button>
                <IconButton label="Zoom in" icon={<Plus className="size-4" />} onClick={zoomIn} />
              </div>
            </div>

            <div className="flex min-h-0 flex-1">
              {sourceDocument.pageCount > 1 && (
                <DocumentThumbnails
                  pageCount={sourceDocument.pageCount}
                  activePage={activePageNumber}
                  onSelectPage={setActivePage}
                />
              )}
              <ScrollArea className="min-h-0 flex-1">
                <DocumentFacsimile
                  document={sourceDocument}
                  pageNumber={activePageNumber}
                  zoom={zoom}
                  highlightSlotId={activeTrace.sourceFieldId ?? null}
                  scrollToActive
                />
              </ScrollArea>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
