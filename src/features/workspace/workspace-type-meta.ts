import { FileStack, FileText, HelpCircle, ListChecks, MessagesSquare, Sparkles, User, type LucideIcon } from 'lucide-react'
import type { WorkspaceObjectType } from '@/types'

export const workspaceTypeMeta: Record<WorkspaceObjectType, { label: string; icon: LucideIcon }> = {
  return: { label: 'Return', icon: FileStack },
  document: { label: 'Document', icon: FileText },
  task: { label: 'Task', icon: ListChecks },
  conversation: { label: 'Conversation', icon: MessagesSquare },
  question: { label: 'Questionnaire item', icon: HelpCircle },
  ai_review: { label: 'AI review', icon: Sparkles },
  client: { label: 'Client', icon: User },
}
