import type { SourceDocument } from '@/types'

const PARAGRAPHS = [
  'These instructions are provided to assist the partner in reporting items shown on Schedule K-1 (Form 1065) on their individual income tax return. Report each item on the form or schedule indicated, using the codes and line references shown on the accompanying summary page.',
  'The amounts shown reflect the partner’s distributive share of partnership income, deductions, credits, and other items for the tax year. Basis limitations, at-risk limitations, and passive activity loss rules may limit the amount of loss, deduction, or credit that can be claimed — consult the general partnership instructions before completing the return.',
  'Keep this schedule for your records. Do not file it with your tax return unless specifically instructed to do so. A copy has also been furnished to the Internal Revenue Service.',
]

interface TextFillerPageProps {
  document: SourceDocument
  pageNumber: number
}

/** Decorative continuation page (fine-print instructions, disclosures) —
 * nothing on it is traceable, it exists purely so multi-page documents
 * feel real when you flip through them. */
export function TextFillerPage({ document, pageNumber }: TextFillerPageProps) {
  return (
    <div className="flex h-full flex-col gap-5 p-8">
      <div className="border-b border-neutral-200 pb-3">
        <p className="text-sm font-semibold text-neutral-900">{document.type}</p>
        <p className="text-[10px] tracking-wide text-neutral-400">
          Page {pageNumber} of {document.pageCount} — Continued
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {PARAGRAPHS.map((paragraph, i) => (
          <p key={i} className="text-[11px] leading-relaxed text-neutral-400">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  )
}
