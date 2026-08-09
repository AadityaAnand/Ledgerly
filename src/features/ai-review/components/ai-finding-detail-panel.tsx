import { motion } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { InspectorPanel } from '@/components/shared/inspector-panel'
import { EmptyState } from '@/components/shared/empty-state'
import { Sparkles } from 'lucide-react'
import { getClientById } from '@/mock/clients'
import { getReturnById } from '@/mock/returns'
import { useHasPermission } from '@/hooks/use-role'
import { fadeIn } from '@/lib/animations'
import { TraceabilityTimeline } from '@/features/return-review/components/traceability-timeline'
import { AIStatusBadge } from './ai-status-badge'
import { ConfidenceDetail } from './confidence-detail'
import { EvidencePanel } from './evidence-panel'
import { AIRecommendationActions } from './ai-recommendation-actions'
import { aiFindingCategoryMeta, aiFindingSeverityMeta } from '../lib/ai-status'
import { cn } from '@/lib/utils'
import type { AIFinding } from '@/types'

interface AIFindingDetailPanelProps {
  finding: AIFinding | null
}

/** Everything a "Review" click reveals — evidence, why it was flagged,
 * confidence detail, the correction workflow, and the AI → human → system
 * handoff timeline. Evidence and history are gated behind `REVIEW_AI` so a
 * client only ever sees the plain-language explanation and recommendation,
 * never the internal review trail. */
export function AIFindingDetailPanel({ finding }: AIFindingDetailPanelProps) {
  const canReview = useHasPermission('REVIEW_AI')

  if (!finding) {
    return (
      <InspectorPanel title="No finding selected">
        <EmptyState
          icon={Sparkles}
          title="Select a finding"
          description="Choose an item from the queue to see the AI's evidence, confidence, and recommended action."
          className="h-full"
        />
      </InspectorPanel>
    )
  }

  const taxReturn = getReturnById(finding.returnId)
  const client = getClientById(finding.clientId)
  const category = aiFindingCategoryMeta[finding.category]

  return (
    <InspectorPanel
      title={finding.title}
      subtitle={`${category.label} · ${client?.name ?? ''}${taxReturn ? ` · ${taxReturn.taxYear} ${taxReturn.formType}` : ''}`}
      actions={<AIStatusBadge status={finding.status} />}
    >
      <motion.div key={finding.id} variants={fadeIn} initial="hidden" animate="visible" className="flex flex-col gap-5 p-4">
        <div className="flex items-center gap-2">
          <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', aiFindingSeverityMeta[finding.severity].tone)}>
            {aiFindingSeverityMeta[finding.severity].label} severity
          </span>
        </div>

        <section className="flex flex-col gap-1.5">
          <h3 className="text-foreground-tertiary text-xs font-semibold tracking-wide uppercase">Why this was flagged</h3>
          <p className="text-foreground-secondary text-sm leading-relaxed">{finding.explanation}</p>
        </section>

        {canReview ? (
          <>
            <ConfidenceDetail confidence={finding.confidence} confidenceReasons={finding.confidenceReasons} uncertaintyReasons={finding.uncertaintyReasons} />

            <Accordion type="multiple" defaultValue={['evidence']}>
              <AccordionItem value="evidence">
                <AccordionTrigger>Evidence</AccordionTrigger>
                <AccordionContent>
                  <EvidencePanel evidence={finding.evidence} returnId={finding.returnId} relatedFieldId={finding.relatedFieldId} />
                </AccordionContent>
              </AccordionItem>

              {finding.timeline.length > 0 && (
                <AccordionItem value="history">
                  <AccordionTrigger>AI → Human → System history</AccordionTrigger>
                  <AccordionContent>
                    <TraceabilityTimeline events={finding.timeline} />
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </>
        ) : (
          <ConfidenceDetail confidence={finding.confidence} confidenceReasons={[]} uncertaintyReasons={undefined} />
        )}

        <section className="flex flex-col gap-2">
          <h3 className="text-foreground-tertiary text-xs font-semibold tracking-wide uppercase">Recommended action</h3>
          <AIRecommendationActions finding={finding} />
        </section>
      </motion.div>
    </InspectorPanel>
  )
}
