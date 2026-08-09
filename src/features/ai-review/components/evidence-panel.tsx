import { FileText } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { getSourceDocumentById } from '@/mock/source-documents'
import { getDocumentById } from '@/mock/documents'
import { cn } from '@/lib/utils'
import type { AIEvidenceItem } from '@/types'

interface EvidencePanelProps {
  evidence: AIEvidenceItem[]
  returnId?: string
  relatedFieldId?: string
  className?: string
}

/** Every meaningful recommendation is backed by evidence a human can go
 * look at themselves — never just an assertion. Discrepant rows are
 * highlighted so the conflict is visible at a glance, not just implied. */
export function EvidencePanel({ evidence, returnId, relatedFieldId, className }: EvidencePanelProps) {
  const navigate = useNavigate()

  if (evidence.length === 0) {
    return (
      <div className={cn('border-border-subtle bg-surface rounded-lg border p-3 text-center', className)}>
        <p className="text-foreground-tertiary text-xs">No evidence available for this finding.</p>
      </div>
    )
  }

  const sourceDocId = evidence.find((e) => e.sourceDocumentId)?.sourceDocumentId
  const sourceDoc = sourceDocId ? getSourceDocumentById(sourceDocId) : undefined
  const listedDoc = sourceDocId ? getDocumentById(sourceDocId) : undefined
  const sourceLabel = sourceDoc?.name ?? listedDoc?.name

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="border-border-subtle divide-border-subtle divide-y rounded-lg border">
        {evidence.map((item) => (
          <div
            key={`${item.label}_${item.value}`}
            className={cn('flex items-center justify-between gap-3 px-3 py-2', item.isDiscrepant && 'bg-danger-subtle/40')}
          >
            <div className="min-w-0">
              <p className="text-foreground-tertiary text-xs">
                {item.label}
                {item.boxLabel ? ` · ${item.boxLabel}` : ''}
                {item.pageNumber ? ` · Page ${item.pageNumber}` : ''}
              </p>
              <p className={cn('truncate text-sm font-medium tabular-nums', item.isDiscrepant ? 'text-danger' : 'text-foreground')}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
      {sourceDocId && (
        <button
          type="button"
          onClick={() => {
            if (returnId && relatedFieldId) {
              void navigate({ to: `/returns/${returnId}?field=${relatedFieldId}` })
            } else {
              void navigate({ to: `/workspace/document/${sourceDocId}` })
            }
          }}
          className="text-primary flex items-center gap-1.5 self-start text-xs font-medium hover:underline"
        >
          <FileText className="size-3.5" aria-hidden="true" />
          View source{sourceLabel ? ` — ${sourceLabel}` : ''} →
        </button>
      )}
    </div>
  )
}
