import { useState } from 'react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { EditableField } from '@/components/shared/field-affordance'
import { staggerContainer, staggerItem } from '@/lib/animations'
import type { QuestionnaireQuestion } from '@/types'

const PREVIEW_COUNT = 2

interface QuestionnaireTeaserProps {
  questions: QuestionnaireQuestion[]
  onContinue: () => void
}

/** Progressive disclosure: only the next couple of unanswered questions are
 * shown, never the full questionnaire. Each answer is editable inline —
 * click, type, save — the same affordance used everywhere else in Ledgerly. */
export function QuestionnaireTeaser({ questions, onContinue }: QuestionnaireTeaserProps) {
  const preview = questions.slice(0, PREVIEW_COUNT)
  const remaining = questions.length - preview.length
  const [answers, setAnswers] = useState<Record<string, string>>({})

  return (
    <div className="flex flex-col gap-3">
      <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-2">
        {preview.map((q) => (
          <motion.li key={q.id} variants={staggerItem} className="border-border-subtle rounded-lg border">
            <EditableField
              label={q.question}
              value={answers[q.id] || 'Tap to answer'}
              editValue={answers[q.id] ?? ''}
              helperText={q.helpText}
              onSave={async (value) => {
                await new Promise((r) => setTimeout(r, 300))
                setAnswers((prev) => ({ ...prev, [q.id]: value }))
                toast.success('Answer saved')
              }}
            />
          </motion.li>
        ))}
      </motion.ul>
      <div className="flex items-center justify-between gap-3 pt-1">
        {remaining > 0 && (
          <p className="text-foreground-tertiary text-xs">+{remaining} more question{remaining === 1 ? '' : 's'}</p>
        )}
        <Button size="sm" variant="outline" className="ml-auto" onClick={onContinue}>
          Continue questionnaire
        </Button>
      </div>
    </div>
  )
}
