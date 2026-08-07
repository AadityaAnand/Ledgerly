import { useState } from 'react'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Check, ChevronRight, Flag, Pencil, Quote, RotateCcw, Sparkles, X } from 'lucide-react'
import { getSourceDocumentById } from '@/mock'
import { currentUser } from '@/mock/users'
import { InspectorPanel } from '@/components/shared/inspector-panel'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { ConfidenceMeter } from '@/components/shared/confidence-meter'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useTraceabilityStore } from '@/store/traceability-store'
import { verificationStatusMeta } from '@/utils/status'
import { formatCurrency, formatDate } from '@/utils/format'
import { getUserById } from '@/mock/users'
import { fadeIn } from '@/lib/animations'
import { TraceabilityTimeline } from './traceability-timeline'
import { EditValueDialog } from './edit-value-dialog'
import { ReviewActionDialog } from './review-action-dialog'
import { cn } from '@/lib/utils'

/** De-dupes the small uppercase eyebrow label used throughout this panel's
 * accordion sections (Transformation steps, Formula, Assumptions, …). */
const sectionLabelTone = {
  tertiary: 'text-foreground-tertiary',
  warning: 'text-warning',
  primary: 'text-primary-subtle-foreground',
} as const

function SectionLabel({
  children,
  tone = 'tertiary',
}: {
  children: ReactNode
  tone?: keyof typeof sectionLabelTone
}) {
  return (
    <p className={cn('text-[10px] font-semibold tracking-wide uppercase', sectionLabelTone[tone])}>
      {children}
    </p>
  )
}

export function AIInspectorPanel() {
  const traces = useTraceabilityStore((s) => s.traces)
  const selectedFieldId = useTraceabilityStore((s) => s.selectedFieldId)
  const approveField = useTraceabilityStore((s) => s.approveField)
  const rejectField = useTraceabilityStore((s) => s.rejectField)
  const flagForReview = useTraceabilityStore((s) => s.flagForReview)
  const editValue = useTraceabilityStore((s) => s.editValue)
  const resetOverride = useTraceabilityStore((s) => s.resetOverride)

  const [editOpen, setEditOpen] = useState(false)
  const [actionDialog, setActionDialog] = useState<'rejected' | 'flagged' | null>(null)

  const trace = traces.find((t) => t.id === selectedFieldId)
  const sourceDocument = trace?.sourceDocumentId ? getSourceDocumentById(trace.sourceDocumentId) : undefined
  const reviewer = trace?.reviewerId ? getUserById(trace.reviewerId) : undefined

  return (
    <>
      <AnimatePresence mode="wait">
        {!trace ? (
          <motion.div
            key="empty"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-full"
          >
            <EmptyState
              icon={Sparkles}
              title="No field selected"
              description="Confidence, source, AI explanation, and review history for the selected field will appear here."
              className="h-full"
            />
          </motion.div>
        ) : (
          <motion.div
            key={trace.id}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-full"
          >
            <InspectorPanel title={trace.label} subtitle={trace.formLine}>
              <div className="flex flex-col gap-5">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-foreground text-2xl font-semibold tracking-tight tabular-nums">
                        {formatCurrency(trace.value)}
                      </p>
                      {trace.originalValue !== undefined && (
                        <p className="text-foreground-tertiary mt-0.5 text-xs">
                          AI originally extracted{' '}
                          <span className="line-through">{formatCurrency(trace.originalValue)}</span>
                        </p>
                      )}
                    </div>
                    <ConfidenceMeter score={trace.confidence} size="lg" />
                  </div>
                  <div className="mt-3">
                    <StatusBadge {...verificationStatusMeta[trace.verification]} />
                  </div>
                </div>

                {trace.hasConflict && trace.conflictNote && (
                  <div className="border-danger/30 bg-danger-subtle flex items-start gap-2.5 rounded-lg border p-3">
                    <AlertTriangle className="text-danger mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-danger-subtle-foreground text-xs font-semibold">
                        Conflicting source values
                      </p>
                      <p className="text-danger-subtle-foreground mt-0.5 text-xs leading-relaxed">
                        {trace.conflictNote}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    className="gap-1.5"
                    disabled={trace.verification === 'verified'}
                    onClick={() => {
                      approveField(trace.id, currentUser.id)
                      toast.success(`${trace.label} approved`)
                    }}
                  >
                    <Check className="size-4" aria-hidden="true" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => setActionDialog('flagged')}
                  >
                    <Flag className="size-4" aria-hidden="true" />
                    Needs review
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setEditOpen(true)}>
                    <Pencil className="size-4" aria-hidden="true" />
                    Edit value
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-danger hover:bg-danger-subtle hover:text-danger gap-1.5"
                    onClick={() => setActionDialog('rejected')}
                  >
                    <X className="size-4" aria-hidden="true" />
                    Reject
                  </Button>
                </div>

                <Accordion type="multiple" defaultValue={['extracted', 'explanation']}>
                  <AccordionItem value="extracted">
                    <AccordionTrigger>Extracted Value</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-3">
                      {sourceDocument ? (
                        <div className="border-border-subtle flex items-center justify-between rounded-lg border px-3 py-2 text-xs">
                          <div className="min-w-0">
                            <p className="text-foreground truncate font-medium">{sourceDocument.name}</p>
                            <p className="text-foreground-tertiary">{sourceDocument.type}</p>
                          </div>
                          <ChevronRight
                            className="text-foreground-tertiary size-4 shrink-0"
                            aria-hidden="true"
                          />
                        </div>
                      ) : (
                        <p className="text-foreground-tertiary text-xs">
                          No source document linked to this value.
                        </p>
                      )}
                      {trace.sourceExcerpt && (
                        <div className="border-border-subtle bg-surface flex gap-2 rounded-lg border p-3">
                          <Quote
                            className="text-foreground-tertiary mt-0.5 size-3.5 shrink-0"
                            aria-hidden="true"
                          />
                          <p className="text-foreground-secondary text-xs leading-relaxed italic">
                            {trace.sourceExcerpt}
                          </p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="explanation">
                    <AccordionTrigger>AI Explanation</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4">
                      <p className="text-foreground-secondary text-xs leading-relaxed">
                        {trace.aiExplanation}
                      </p>

                      {trace.transformationSteps.length > 0 && (
                        <div>
                          <SectionLabel>Transformation steps</SectionLabel>
                          <ol className="mt-1.5 flex flex-col gap-1.5">
                            {trace.transformationSteps.map((step, i) => (
                              <li
                                key={i}
                                className="text-foreground-secondary flex gap-2 text-xs leading-relaxed"
                              >
                                <span className="text-foreground-tertiary shrink-0 tabular-nums">
                                  {i + 1}.
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {trace.calculationFormula && (
                        <div>
                          <SectionLabel>Formula</SectionLabel>
                          <code className="bg-surface border-border-subtle text-foreground mt-1.5 block rounded-lg border px-3 py-2 text-xs tabular-nums">
                            {trace.calculationFormula}
                          </code>
                        </div>
                      )}

                      {trace.assumptions && trace.assumptions.length > 0 && (
                        <div>
                          <SectionLabel>Assumptions</SectionLabel>
                          <ul className="mt-1.5 flex flex-col gap-1">
                            {trace.assumptions.map((item, i) => (
                              <li
                                key={i}
                                className="text-foreground-secondary text-xs leading-relaxed before:mr-1.5 before:content-['—']"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {trace.risks && trace.risks.length > 0 && (
                        <div>
                          <SectionLabel tone="warning">Potential risks</SectionLabel>
                          <ul className="mt-1.5 flex flex-col gap-1">
                            {trace.risks.map((item, i) => (
                              <li
                                key={i}
                                className="text-foreground-secondary text-xs leading-relaxed before:mr-1.5 before:content-['—']"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {trace.suggestedAction && (
                        <div className="bg-primary-subtle rounded-lg p-3">
                          <SectionLabel tone="primary">Suggested next step</SectionLabel>
                          <p className="text-primary-subtle-foreground mt-1 text-xs leading-relaxed">
                            {trace.suggestedAction}
                          </p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="validation">
                    <AccordionTrigger>Validation Rules</AccordionTrigger>
                    <AccordionContent>
                      <ul className="flex flex-col gap-2">
                        {trace.validationRules.map((rule) => (
                          <li key={rule.label} className="flex items-center gap-2 text-xs">
                            <span
                              className={cn(
                                'flex size-4 shrink-0 items-center justify-center rounded-full',
                                rule.passed
                                  ? 'bg-success-subtle text-success-subtle-foreground'
                                  : 'bg-danger-subtle text-danger-subtle-foreground'
                              )}
                            >
                              {rule.passed ? <Check className="size-2.5" /> : <X className="size-2.5" />}
                            </span>
                            <span
                              className={
                                rule.passed ? 'text-foreground-secondary' : 'text-foreground font-medium'
                              }
                            >
                              {rule.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="history">
                    <AccordionTrigger>Review & History</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-3">
                      {reviewer && trace.reviewedAt && (
                        <div className="flex items-center gap-2.5">
                          <UserAvatar name={reviewer.name} size="sm" />
                          <div className="min-w-0">
                            <p className="text-foreground text-xs font-medium">{reviewer.name}</p>
                            <p className="text-foreground-tertiary text-xs">
                              Last reviewed{' '}
                              {formatDate(trace.reviewedAt, { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                          </div>
                        </div>
                      )}

                      {trace.reviewHistory.length === 0 ? (
                        <p className="text-foreground-tertiary text-xs">No review actions taken yet.</p>
                      ) : (
                        <ul className="flex flex-col gap-2.5">
                          {[...trace.reviewHistory].reverse().map((entry) => {
                            const actor = getUserById(entry.actorId)
                            return (
                              <li key={entry.id} className="border-border-subtle rounded-lg border p-2.5">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-foreground text-xs font-medium capitalize">
                                    {actor?.name ?? 'Someone'} {entry.action}
                                  </span>
                                  <span className="text-foreground-tertiary text-[10px]">
                                    {formatDate(entry.timestamp, { month: 'short', day: 'numeric' })}
                                  </span>
                                </div>
                                {entry.previousValue !== undefined && entry.newValue !== undefined && (
                                  <p className="mt-1 text-xs tabular-nums">
                                    <span className="text-foreground-tertiary line-through">
                                      {formatCurrency(entry.previousValue)}
                                    </span>{' '}
                                    <span className="text-foreground font-medium">
                                      → {formatCurrency(entry.newValue)}
                                    </span>
                                  </p>
                                )}
                                {entry.note && (
                                  <p className="text-foreground-secondary mt-1 text-xs leading-relaxed">
                                    {entry.note}
                                  </p>
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      )}

                      {trace.originalValue !== undefined && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-foreground-secondary w-fit gap-1.5"
                          onClick={() => {
                            resetOverride(trace.id, currentUser.id)
                            toast(`${trace.label} reverted to the AI-extracted value`)
                          }}
                        >
                          <RotateCcw className="size-3.5" aria-hidden="true" />
                          Revert to AI value
                        </Button>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div>
                  <SectionLabel>Timeline</SectionLabel>
                  <div className="mt-3">
                    <TraceabilityTimeline events={trace.timeline} />
                  </div>
                </div>
              </div>
            </InspectorPanel>
          </motion.div>
        )}
      </AnimatePresence>

      <EditValueDialog
        trace={trace ?? null}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={({ value, note }) => {
          if (!trace) return
          editValue(trace.id, value, currentUser.id, note)
          toast.success(`${trace.label} updated to ${formatCurrency(value)}`)
        }}
      />
      {trace && (
        <ReviewActionDialog
          open={actionDialog !== null}
          onOpenChange={(open) => !open && setActionDialog(null)}
          action={actionDialog ?? 'flagged'}
          fieldLabel={trace.label}
          onSubmit={(note) => {
            if (actionDialog === 'rejected') {
              rejectField(trace.id, currentUser.id, note)
              toast(`${trace.label} rejected`)
            } else {
              flagForReview(trace.id, currentUser.id, note)
              toast(`${trace.label} flagged for review`)
            }
          }}
        />
      )}
    </>
  )
}
