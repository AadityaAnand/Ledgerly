import { MessageBubble } from './message-bubble'
import { AISuggestionBubble } from './ai-suggestion-bubble'
import { DocumentRequestCard } from './document-request-card'
import { ApprovalCard } from './approval-card'
import { SystemMessage } from './system-message'
import type { ConversationMessage } from '@/types'

interface MessageItemProps {
  message: ConversationMessage
  replyToMessage?: ConversationMessage
  onUseSuggestion?: (body: string) => void
}

export function MessageItem({ message, replyToMessage, onUseSuggestion }: MessageItemProps) {
  switch (message.kind) {
    case 'system':
      return <SystemMessage body={message.body} createdAt={message.createdAt} />
    case 'ai_suggestion':
      return <AISuggestionBubble message={message} onUseSuggestion={onUseSuggestion} />
    case 'document_request':
      return <DocumentRequestCard message={message} />
    case 'approval':
      return <ApprovalCard message={message} />
    case 'message':
    case 'internal_note':
    default:
      return <MessageBubble message={message} replyToMessage={replyToMessage} />
  }
}
