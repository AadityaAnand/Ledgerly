import { CheckSquare, FileCheck2, MessageSquareWarning, OctagonAlert, Sparkles, UserCheck, PenLine, type LucideIcon } from 'lucide-react'
import type { WorkItemCategory } from '@/types'

export const workItemCategoryMeta: Record<WorkItemCategory, { label: string; icon: LucideIcon }> = {
  ai_review: { label: 'AI Review', icon: Sparkles },
  missing_document: { label: 'Waiting on Client', icon: MessageSquareWarning },
  blocked: { label: 'Blocked', icon: OctagonAlert },
  cpa_review: { label: 'CPA Review', icon: UserCheck },
  client_review: { label: 'Client Review', icon: PenLine },
  ready_to_file: { label: 'Ready to File', icon: FileCheck2 },
  task: { label: 'Task', icon: CheckSquare },
}
