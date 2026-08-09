import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useActiveRoleUser, useHasPermission } from '@/hooks/use-role'
import { useAIReviewStore } from '@/store/ai-review-store'
import { CorrectionWorkflow } from './correction-workflow'
import type { AIFinding } from '@/types'

interface AIRecommendationActionsProps {
  finding: AIFinding
}

/** AI never changes tax data on its own — every consequential action here
 * requires an explicit human click, and the buttons available are gated by
 * role so nobody sees an action they can't actually take. */
export function AIRecommendationActions({ finding }: AIRecommendationActionsProps) {
  const navigate = useNavigate()
  const user = useActiveRoleUser()
  const canReview = useHasPermission('REVIEW_AI')
  const canEdit = useHasPermission('EDIT_RETURN')
  const { acceptSuggestion, requestDocument, markExpected, dismissFinding, rejectFinding } = useAIReviewStore()
  const [correcting, setCorrecting] = useState(false)

  const isResolved = finding.status === 'human_verified' || finding.status === 'human_corrected' || finding.status === 'rejected' || finding.status === 'dismissed'

  function withToast(label: string, run: () => void) {
    run()
    toast.success(label)
  }

  if (correcting) {
    return <CorrectionWorkflow finding={finding} onClose={() => setCorrecting(false)} />
  }

  if (!canReview) {
    // Client / seasonal staff: no consequential actions, only the ability
    // to ask their CPA about it.
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            withToast('Sent to your CPA', () => void navigate({ to: `/returns/${finding.returnId}` }))
          }
        >
          Ask CPA
        </Button>
      </div>
    )
  }

  if (isResolved) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => void navigate({ to: `/returns/${finding.returnId}` })}>
          View in return
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {finding.suggestedValue !== undefined && (
        <Button size="sm" onClick={() => withToast('Suggestion accepted', () => acceptSuggestion(finding.id, user.id))}>
          Accept suggested value
        </Button>
      )}
      {finding.category === 'discrepancy' || finding.category === 'conflicting_values' || finding.category === 'calculation_issue' ? (
        <Button
          size="sm"
          variant={finding.suggestedValue !== undefined ? 'outline' : 'default'}
          onClick={() => void navigate({ to: `/returns/${finding.returnId}${finding.relatedFieldId ? `?field=${finding.relatedFieldId}` : ''}` })}
        >
          Review discrepancy
        </Button>
      ) : null}
      {finding.category === 'missing_document' || finding.category === 'unusual_deduction' ? (
        <Button size="sm" variant="outline" onClick={() => withToast('Document request sent to client', () => requestDocument(finding.id, user.id))}>
          Request document
        </Button>
      ) : null}
      {finding.category === 'duplicate_document' && (
        <Button size="sm" variant="outline" onClick={() => withToast('Marked as expected', () => markExpected(finding.id, user.id))}>
          Mark as expected
        </Button>
      )}
      {canEdit && finding.currentValue !== undefined && (
        <Button size="sm" variant="outline" onClick={() => setCorrecting(true)}>
          Edit value
        </Button>
      )}
      <Button size="sm" variant="ghost" onClick={() => withToast('Finding dismissed', () => dismissFinding(finding.id, user.id))}>
        Dismiss finding
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="text-danger hover:text-danger"
        onClick={() => withToast('Finding rejected', () => rejectFinding(finding.id, user.id))}
      >
        Reject
      </Button>
    </div>
  )
}
