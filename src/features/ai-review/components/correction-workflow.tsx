import { useEffect, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useActiveRoleUser, useHasPermission } from '@/hooks/use-role'
import { useAIReviewStore } from '@/store/ai-review-store'
import { fadeIn } from '@/lib/animations'
import { formatCurrency } from '@/utils/format'
import type { AIFinding } from '@/types'

interface CorrectionWorkflowProps {
  finding: AIFinding
  onClose: () => void
}

/** Correcting AI output never leaves the review queue for a modal or a
 * different page — enter the value and a reason inline, see AI-suggested
 * vs. your value vs. source side by side, then save. The correction
 * becomes part of the finding's review history automatically. */
export function CorrectionWorkflow({ finding, onClose }: CorrectionWorkflowProps) {
  const user = useActiveRoleUser()
  const canApprove = useHasPermission('APPROVE_RETURN')
  const { correctValue, markVerified } = useAIReviewStore()

  const [value, setValue] = useState(String(finding.correctedValue ?? finding.currentValue ?? ''))
  const [reason, setReason] = useState('')
  const [saved, setSaved] = useState(finding.status === 'human_corrected')
  const valueInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!saved) valueInputRef.current?.focus()
  }, [saved])

  function handleSave() {
    const parsed = Number(value.replace(/,/g, ''))
    if (Number.isNaN(parsed)) {
      toast.error('Enter a valid number')
      return
    }
    if (!reason.trim()) {
      toast.error('Add a short reason for this correction')
      return
    }
    correctValue(finding.id, parsed, reason.trim(), user.id)
    setSaved(true)
    toast.success('Correction saved')
  }

  if (saved) {
    const corrected = finding.correctedValue
    return (
      <motion.div variants={fadeIn} initial="hidden" animate="visible" className="border-border-subtle bg-surface flex flex-col gap-3 rounded-lg border p-3">
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-foreground-tertiary text-xs">AI suggestion</p>
            <p className="text-foreground-secondary font-medium tabular-nums line-through decoration-1">
              {finding.suggestedValue !== undefined ? formatCurrency(finding.suggestedValue) : '—'}
            </p>
          </div>
          <div>
            <p className="text-foreground-tertiary text-xs">Your value</p>
            <p className="text-foreground font-semibold tabular-nums">
              {corrected !== undefined ? formatCurrency(corrected) : '—'}
            </p>
          </div>
          <div>
            <p className="text-foreground-tertiary text-xs">Source</p>
            <p className="text-foreground-secondary font-medium">{finding.relatedDocumentId ? 'Source document' : 'Manual entry'}</p>
          </div>
        </div>
        {finding.correctionReason && (
          <p className="text-foreground-secondary text-xs leading-relaxed">Reason: {finding.correctionReason}</p>
        )}
        <div className="flex items-center gap-2">
          {canApprove && finding.status !== 'human_verified' && (
            <Button size="sm" onClick={() => withVerify()}>
              Mark verified
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </motion.div>
    )
  }

  function withVerify() {
    markVerified(finding.id, user.id)
    toast.success('Marked verified')
  }

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="border-border-subtle bg-surface flex flex-col gap-2.5 rounded-lg border p-3">
      <div>
        <p className="text-foreground-tertiary text-xs">AI suggested</p>
        <p className="text-foreground text-sm font-semibold tabular-nums">
          {finding.suggestedValue !== undefined ? formatCurrency(finding.suggestedValue) : finding.currentValue !== undefined ? formatCurrency(finding.currentValue) : '—'}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`correction-value-${finding.id}`} className="text-foreground-tertiary text-xs font-medium">
          Enter corrected value
        </label>
        <Input
          ref={valueInputRef}
          id={`correction-value-${finding.id}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputMode="decimal"
          className="h-8 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`correction-reason-${finding.id}`} className="text-foreground-tertiary text-xs font-medium">
          Reason
        </label>
        <Textarea
          id={`correction-reason-${finding.id}`}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Updated K-1 received"
          className="min-h-16 text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleSave} className="gap-1.5">
          <Check className="size-3.5" aria-hidden="true" />
          Save correction
        </Button>
        <Button size="sm" variant="ghost" onClick={onClose} className="gap-1.5">
          <X className="size-3.5" aria-hidden="true" />
          Cancel
        </Button>
      </div>
    </motion.div>
  )
}
