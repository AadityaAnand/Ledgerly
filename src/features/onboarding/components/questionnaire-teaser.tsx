import { HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { staggerContainer, staggerItem } from '@/lib/animations'
import type { QuestionnaireQuestion } from '@/types'

const PREVIEW_COUNT = 2

interface QuestionnaireTeaserProps {
  questions: QuestionnaireQuestion[]
  onContinue: () => void
}

/** Progressive disclosure: only the next couple of unanswered questions are
 * shown, never the full questionnaire. */
export function QuestionnaireTeaser({ questions, onContinue }: QuestionnaireTeaserProps) {
  const preview = questions.slice(0, PREVIEW_COUNT)
  const remaining = questions.length - preview.length

  return (
    <div className="flex flex-col gap-3">
      <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-2">
        {preview.map((q) => (
          <motion.li
            key={q.id}
            variants={staggerItem}
            className="border-border-subtle flex items-start gap-2.5 rounded-lg border px-3 py-2.5"
          >
            <HelpCircle className="text-foreground-tertiary mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-foreground text-sm font-medium">{q.question}</p>
              {q.helpText && <p className="text-foreground-tertiary mt-0.5 text-xs">{q.helpText}</p>}
            </div>
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
