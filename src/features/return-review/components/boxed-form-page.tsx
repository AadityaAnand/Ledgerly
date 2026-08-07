import type { DocumentFieldSlot, SourceDocument } from '@/types'

interface BoxedFormPageProps {
  document: SourceDocument
  slots: DocumentFieldSlot[]
}

/** Renders a form-style document (W-2, 1099s, 1098, K-1) as a grid of
 * numbered boxes, mirroring how real IRS-style forms are laid out. */
export function BoxedFormPage({ document, slots }: BoxedFormPageProps) {
  return (
    <div className="flex h-full flex-col gap-6 p-8">
      <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
        <div>
          <p className="text-[10px] font-medium tracking-wide text-neutral-400 uppercase">Payer</p>
          <p className="text-sm font-semibold text-neutral-900">{document.issuer}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-neutral-900">{document.type}</p>
          <p className="text-[10px] tracking-wide text-neutral-400">Tax Year 2025</p>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-medium tracking-wide text-neutral-400 uppercase">Recipient</p>
        <p className="text-sm font-medium text-neutral-900">{document.recipient}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {slots.map((slot) => (
          <div
            key={slot.id}
            data-field-slot={slot.id}
            className="rounded-sm border border-neutral-200 bg-neutral-50/60 p-3"
          >
            <p className="text-[10px] font-medium tracking-wide text-neutral-400 uppercase">
              {slot.boxLabel ? `${slot.boxLabel} — ${slot.label}` : slot.label}
            </p>
            <p className="mt-1 text-sm font-semibold text-neutral-900 tabular-nums">{slot.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
