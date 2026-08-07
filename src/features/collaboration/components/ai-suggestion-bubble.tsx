import { useState } from 'react'
import { ChevronDown, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { staggerItem, transitions } from '@/lib/animations'
import { cn } from '@/lib/utils'
import type { AISuggestionType, ConversationMessage } from '@/types'

const suggestionLabel: Record<AISuggestionType, string> = {
  suggested_response: 'Suggested reply',
  summary: 'Thread summary',
  follow_up: 'Follow-up suggestion',
  missing_documents: 'Missing documents detected',
  next_action: 'Suggested next action',
}

interface AISuggestionBubbleProps {
  message: ConversationMessage
  onUseSuggestion?: (body: string) => void
}

export function AISuggestionBubble({ message, onUseSuggestion }: AISuggestionBubbleProps) {
  const [expanded, setExpanded] = useState(false)
  const type = message.aiSuggestionType ?? 'summary'
  const label = suggestionLabel[type]

  return (
    <motion.div
      variants={staggerItem}
      className="border-ai-200 bg-ai-subtle/40 mx-1 my-2 overflow-hidden rounded-lg border"
    >
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="focus-visible:-outline-offset-2 flex w-full items-center gap-2 px-3 py-2 text-left"
      >
        <span className="bg-ai-subtle text-ai-subtle-foreground flex size-6 shrink-0 items-center justify-center rounded-full">
          <Sparkles className="size-3.5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-ai-subtle-foreground text-xs font-semibold">{label}</span>
          {!expanded && <span className="text-foreground-tertiary ml-2 truncate text-xs">{message.body}</span>}
        </span>
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={transitions.fast}>
          <ChevronDown className="text-foreground-tertiary size-4" aria-hidden="true" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={transitions.base}
        className={cn('overflow-hidden', !expanded && 'pointer-events-none')}
      >
        <div className="px-3 pb-3">
          <p className="text-foreground-secondary text-xs leading-relaxed">{message.body}</p>
          {type === 'suggested_response' && onUseSuggestion && (
            <Button
              size="sm"
              variant="outline"
              className="mt-2 h-7 text-xs"
              onClick={() => onUseSuggestion(message.body.replace(/^Suggested reply:\s*/i, '').replace(/["“”]/g, ''))}
            >
              Use this reply
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
