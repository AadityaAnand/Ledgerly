import { cn } from '@/lib/utils'
import type { DocumentFieldSlot, SourceDocument } from '@/types'

interface StatementPageProps {
  document: SourceDocument
  pageNumber: number
  slots: DocumentFieldSlot[]
}

/** Renders a statement-style document (P&L, bank/brokerage statements,
 * receipts) as a header over a table of line items. */
export function StatementPage({ document, pageNumber, slots }: StatementPageProps) {
  return (
    <div className="flex h-full flex-col gap-6 p-8">
      <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
        <div>
          <p className="text-sm font-semibold text-neutral-900">{document.issuer}</p>
          <p className="text-[10px] tracking-wide text-neutral-400">{document.type}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-neutral-700">{document.recipient}</p>
          <p className="text-[10px] tracking-wide text-neutral-400">
            Page {pageNumber} of {document.pageCount}
          </p>
        </div>
      </div>

      <div className="flex flex-col overflow-hidden rounded-sm border border-neutral-200">
        {slots.map((slot) => {
          const isTotal = slot.label.toLowerCase().startsWith('total')
          return (
            <div
              key={slot.id}
              data-field-slot={slot.id}
              className={cn(
                'flex items-center justify-between border-b border-neutral-100 px-4 py-2.5 last:border-b-0',
                isTotal && 'bg-neutral-50'
              )}
            >
              <span className={cn('text-sm text-neutral-600', isTotal && 'font-semibold text-neutral-900')}>
                {slot.label}
              </span>
              <span
                className={cn(
                  'text-sm font-medium text-neutral-900 tabular-nums',
                  isTotal && 'font-semibold'
                )}
              >
                {slot.value}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
