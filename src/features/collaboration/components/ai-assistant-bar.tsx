import { useState } from 'react'
import { ChevronUp, FileWarning, ListChecks, MessageSquareText, Sparkles, Wand2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { transitions } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface AIAssistantAction {
  id: string
  label: string
  icon: typeof Sparkles
  response: string
}

const actions: AIAssistantAction[] = [
  {
    id: 'summarize',
    label: 'Summarize thread',
    icon: ListChecks,
    response:
      'Laura flagged a mismatch on a 1099-NEC, uploaded a corrected copy, and Marcus confirmed it now matches the P&L. Awaiting Priya’s sign-off to close this out.',
  },
  {
    id: 'follow_up',
    label: 'Generate follow-up',
    icon: MessageSquareText,
    response: 'Hi Laura — just confirming everything looks good on our end now. We’ll follow up once the return is finalized.',
  },
  {
    id: 'missing_docs',
    label: 'Detect missing documents',
    icon: FileWarning,
    response: 'No outstanding documents detected for this conversation.',
  },
  {
    id: 'next_action',
    label: 'Suggest next action',
    icon: Wand2,
    response: 'Get Priya Nathan’s review sign-off, then mark this conversation resolved.',
  },
]

export function AIAssistantBar() {
  const [expanded, setExpanded] = useState(false)
  const [activeResponse, setActiveResponse] = useState<AIAssistantAction | null>(null)

  return (
    <div className="border-border-subtle bg-ai-subtle/30 shrink-0 border-t">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="focus-visible:-outline-offset-2 flex w-full items-center gap-2 px-4 py-2"
      >
        <Sparkles className="text-ai size-3.5" aria-hidden="true" />
        <span className="text-ai-subtle-foreground text-xs font-medium">AI Assistant</span>
        <motion.span animate={{ rotate: expanded ? 0 : 180 }} transition={transitions.fast} className="ml-auto">
          <ChevronUp className="text-foreground-tertiary size-3.5" aria-hidden="true" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transitions.base}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-1.5 px-4 pb-3">
              {actions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => setActiveResponse(action)}
                  className={cn(
                    'border-border-subtle bg-surface-raised hover:bg-surface-hover focus-visible:-outline-offset-2 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors',
                    activeResponse?.id === action.id && 'border-ai-300 bg-ai-subtle text-ai-subtle-foreground'
                  )}
                >
                  <action.icon className="size-3.5" aria-hidden="true" />
                  {action.label}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              {activeResponse && (
                <motion.div
                  key={activeResponse.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={transitions.fast}
                  className="px-4 pb-3"
                >
                  <p className="border-ai-200 bg-surface-raised text-foreground-secondary rounded-lg border px-3 py-2 text-xs leading-relaxed">
                    {activeResponse.response}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
