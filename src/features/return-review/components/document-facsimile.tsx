import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getFieldSlotsForDocumentPage } from '@/mock'
import { panelSwap } from '@/lib/animations'
import { DocumentPageCanvas } from './document-page-canvas'
import { BoxedFormPage } from './boxed-form-page'
import { StatementPage } from './statement-page'
import { TextFillerPage } from './text-filler-page'
import { HighlightOverlay } from './highlight-overlay'
import type { SourceDocument } from '@/types'

interface DocumentFacsimileProps {
  document: SourceDocument
  pageNumber: number
  zoom: number
  /** The DocumentFieldSlot id to highlight — not the tax field trace's own id. */
  highlightSlotId: string | null
  scrollToActive?: boolean
}

export function DocumentFacsimile({
  document,
  pageNumber,
  zoom,
  highlightSlotId,
  scrollToActive,
}: DocumentFacsimileProps) {
  const [pageEl, setPageEl] = useState<HTMLDivElement | null>(null)
  const layout = document.pageLayouts?.[pageNumber] ?? document.layout
  const slots = getFieldSlotsForDocumentPage(document.id, pageNumber)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${document.id}-${pageNumber}`}
        variants={panelSwap}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <DocumentPageCanvas ref={setPageEl} zoom={zoom}>
          {layout === 'boxed-form' && <BoxedFormPage document={document} slots={slots} />}
          {layout === 'statement' && (
            <StatementPage document={document} pageNumber={pageNumber} slots={slots} />
          )}
          {layout === 'text-page' && <TextFillerPage document={document} pageNumber={pageNumber} />}
          <HighlightOverlay
            containerEl={pageEl}
            targetFieldId={highlightSlotId}
            scrollIntoView={scrollToActive}
          />
        </DocumentPageCanvas>
      </motion.div>
    </AnimatePresence>
  )
}
