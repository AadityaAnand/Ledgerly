import { useEffect, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Lock, MessageSquare, Paperclip, SendHorizonal } from 'lucide-react'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/shared/icon-button'
import { cn } from '@/lib/utils'
import type { MessageVisibility } from '@/types'

interface MessageComposerProps {
  onSend: (body: string, visibility: MessageVisibility) => void
  draft?: string
  onDraftConsumed?: () => void
}

export function MessageComposer({ onSend, draft, onDraftConsumed }: MessageComposerProps) {
  const [body, setBody] = useState(draft ?? '')
  const [visibility, setVisibility] = useState<MessageVisibility>('client')

  useEffect(() => {
    if (draft && draft.length > 0) {
      // One-shot sync from a parent-issued "apply this suggestion" command,
      // not state derived from props on every render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBody(draft)
      onDraftConsumed?.()
    }
    // Only re-run when a new draft arrives — onDraftConsumed is stable enough
    // in practice and including it would re-fire this on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  function handleSend() {
    const trimmed = body.trim()
    if (!trimmed) return
    onSend(trimmed, visibility)
    setBody('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-border shrink-0 border-t p-3">
      <div className="border-border-subtle bg-surface-raised focus-within:ring-ring/50 rounded-xl border transition-shadow focus-within:ring-2">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={visibility === 'internal' ? 'Write an internal note…' : 'Write a message…'}
          rows={2}
          className="min-h-16 resize-none border-0 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center justify-between gap-2 px-2 pb-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setVisibility('client')}
              aria-pressed={visibility === 'client'}
              className={cn(
                'focus-visible:-outline-offset-2 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                visibility === 'client'
                  ? 'bg-primary-subtle text-primary-subtle-foreground'
                  : 'text-foreground-tertiary hover:bg-surface-hover'
              )}
            >
              <MessageSquare className="size-3.5" aria-hidden="true" />
              Reply to client
            </button>
            <button
              type="button"
              onClick={() => setVisibility('internal')}
              aria-pressed={visibility === 'internal'}
              className={cn(
                'focus-visible:-outline-offset-2 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                visibility === 'internal'
                  ? 'bg-muted text-muted-foreground'
                  : 'text-foreground-tertiary hover:bg-surface-hover'
              )}
            >
              <Lock className="size-3.5" aria-hidden="true" />
              Internal note
            </button>
            <IconButton
              label="Attach file"
              icon={<Paperclip className="size-4" />}
              onClick={() => toast('Attachments aren’t wired up yet.')}
            />
          </div>
          <Button size="sm" className="h-8 gap-1.5" disabled={!body.trim()} onClick={handleSend}>
            Send
            <SendHorizonal className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
