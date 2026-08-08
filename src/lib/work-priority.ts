import { differenceInCalendarDays, parseISO } from 'date-fns'
import { taxReturns, getReturnById } from '@/mock/returns'
import { getClientById } from '@/mock/clients'
import { tasks } from '@/mock/tasks'
import { aiSuggestions } from '@/mock/ai-suggestions'
import { getUserById } from '@/mock/users'
import { conversationMessages } from '@/mock/conversation-messages'
import { getConversationById } from '@/mock/conversations'
import { getEffectiveReturnStatus, conditionLabels } from '@/lib/return-lifecycle'
import { resolveWorkspaceHref } from '@/lib/object-graph'
import type { AISuggestionSeverity, TaskPriority, WorkItem, WorkItemCategory } from '@/types'

const TODAY = new Date('2026-08-07T12:00:00.000Z')

const categoryWeight: Record<WorkItemCategory, number> = {
  blocked: 40,
  ai_review: 25,
  missing_document: 22,
  cpa_review: 20,
  client_review: 14,
  ready_to_file: 12,
  task: 10,
}

const priorityWeight: Record<TaskPriority, number> = {
  urgent: 50,
  high: 30,
  medium: 15,
  low: 5,
}

const ctaLabelByCategory: Record<WorkItemCategory, string> = {
  blocked: 'Resolve issue',
  ai_review: 'Review values',
  missing_document: 'Send reminder',
  cpa_review: 'Review return',
  client_review: 'Open return',
  ready_to_file: 'File return',
  task: 'Open task',
}

const severityToPriority: Record<AISuggestionSeverity, TaskPriority> = {
  critical: 'urgent',
  warning: 'high',
  info: 'low',
}

/** Urgency score from a due date — overdue and due-today dominate, far-out
 * dates barely move the needle. Deterministic, not fancy. */
function urgencyScore(dueDate: string | undefined): number {
  if (!dueDate) return 0
  const days = differenceInCalendarDays(parseISO(dueDate), TODAY)
  if (days < 0) return 100
  if (days === 0) return 80
  if (days === 1) return 60
  if (days <= 7) return 30
  if (days <= 14) return 15
  return 5
}

/** Older open work bubbles up slightly so nothing sits forgotten. Capped so
 * age alone can never outrank genuine urgency or blocking status. */
function ageScore(createdAt: string): number {
  const days = Math.max(0, differenceInCalendarDays(TODAY, parseISO(createdAt)))
  return Math.min(days, 14)
}

function score(item: Pick<WorkItem, 'category' | 'priority' | 'dueDate' | 'createdAt'>): number {
  return categoryWeight[item.category] + priorityWeight[item.priority] + urgencyScore(item.dueDate) + ageScore(item.createdAt)
}

function finalize(item: Omit<WorkItem, 'score'>): WorkItem {
  return { ...item, score: score(item) }
}

function fromTasks(): WorkItem[] {
  return tasks
    .filter((t) => t.status !== 'done')
    .map((task) => {
      const client = task.clientId ? getClientById(task.clientId) : undefined
      const taxReturn = task.returnId ? getReturnById(task.returnId) : undefined
      const detail = taxReturn ? getEffectiveReturnStatus(taxReturn) : undefined

      let category: WorkItemCategory = 'task'
      if (detail?.blocker) category = 'blocked'
      else if (detail?.condition === 'waiting_on_client') category = 'missing_document'
      else if (detail?.stage === 'cpa_review') category = 'cpa_review'
      else if (detail?.stage === 'client_review') category = 'client_review'
      else if (detail?.stage === 'ready_to_file') category = 'ready_to_file'

      const reason =
        detail?.blocker?.reason ??
        task.description ??
        (detail?.condition ? conditionLabels[detail.condition] : 'Assigned to you')

      const ctaHref = task.returnId
        ? resolveWorkspaceHref('return', task.returnId)
        : task.clientId
          ? resolveWorkspaceHref('client', task.clientId)
          : '/tasks'

      return finalize({
        id: `wi_task_${task.id}`,
        category,
        clientId: task.clientId,
        clientName: client?.name,
        returnId: task.returnId,
        returnLabel: taxReturn ? `${taxReturn.taxYear} ${taxReturn.formType}` : undefined,
        taskId: task.id,
        title: task.title,
        reason,
        priority: task.priority,
        dueDate: task.dueDate,
        ownerId: task.assigneeId,
        conditionLabel: detail?.condition ? conditionLabels[detail.condition] : undefined,
        ctaLabel: category === 'task' ? 'Open task' : ctaLabelByCategory[category],
        ctaHref,
        createdAt: task.createdAt,
      })
    })
}

function fromAISuggestions(): WorkItem[] {
  return aiSuggestions
    .filter((s) => !s.resolved)
    .map((suggestion) => {
      const taxReturn = getReturnById(suggestion.returnId)
      const client = taxReturn ? getClientById(taxReturn.clientId) : undefined
      const ownerId = taxReturn?.assignedReviewerId ?? taxReturn?.assignedPreparerId ?? 'usr_2'

      return finalize({
        id: `wi_ai_${suggestion.id}`,
        category: 'ai_review',
        clientId: client?.id,
        clientName: client?.name,
        returnId: taxReturn?.id,
        returnLabel: taxReturn ? `${taxReturn.taxYear} ${taxReturn.formType}` : undefined,
        title: suggestion.title,
        reason: suggestion.description,
        priority: severityToPriority[suggestion.severity],
        dueDate: taxReturn?.dueDate,
        ownerId,
        ctaLabel: ctaLabelByCategory.ai_review,
        ctaHref: resolveWorkspaceHref('ai_review', suggestion.id),
        createdAt: suggestion.createdAt,
      })
    })
}

function fromDocumentRequests(): WorkItem[] {
  return conversationMessages
    .filter((m) => m.kind === 'document_request' && m.documentRequest && m.documentRequest.status !== 'received')
    .map((message) => {
      const conversation = getConversationById(message.conversationId)
      const client = conversation ? getClientById(conversation.clientId) : undefined
      const taxReturn = conversation?.returnId ? getReturnById(conversation.returnId) : undefined
      const staffParticipant = conversation?.participantIds.find((id) => getUserById(id)?.role !== 'client')
      const ownerId = taxReturn?.assignedPreparerId ?? staffParticipant ?? conversation?.ownerId ?? 'usr_2'

      return finalize({
        id: `wi_doc_${message.id}`,
        category: 'missing_document',
        clientId: client?.id,
        clientName: client?.name,
        returnId: taxReturn?.id,
        returnLabel: taxReturn ? `${taxReturn.taxYear} ${taxReturn.formType}` : undefined,
        title: `Missing ${message.documentRequest!.documentName}`,
        reason: 'Requested from the client — no response yet.',
        priority: message.documentRequest!.status === 'overdue' ? 'urgent' : 'medium',
        dueDate: message.documentRequest!.dueDate,
        ownerId,
        conditionLabel: 'Waiting on Client',
        ctaLabel: ctaLabelByCategory.missing_document,
        ctaHref: conversation ? resolveWorkspaceHref('conversation', conversation.id) : '/messages',
        createdAt: message.createdAt,
      })
    })
}

function fromReturnsNeedingAction(coveredReturnIds: Set<string>): WorkItem[] {
  return taxReturns
    .filter((r) => !coveredReturnIds.has(r.id))
    .map((taxReturn) => {
      const detail = getEffectiveReturnStatus(taxReturn)
      if (detail.stage !== 'cpa_review' && detail.stage !== 'ready_to_file') return null
      if (detail.blocker) return null // already represented in the blocked stream via its task, if any

      const client = getClientById(taxReturn.clientId)
      const category: WorkItemCategory = detail.stage
      const ownerId =
        detail.stage === 'cpa_review'
          ? (taxReturn.assignedReviewerId ?? taxReturn.assignedPreparerId)
          : taxReturn.assignedPreparerId

      return finalize({
        id: `wi_return_${taxReturn.id}`,
        category,
        clientId: client?.id,
        clientName: client?.name,
        returnId: taxReturn.id,
        returnLabel: `${taxReturn.taxYear} ${taxReturn.formType}`,
        title:
          detail.stage === 'cpa_review'
            ? `${client?.name ?? 'Return'} is ready for your review`
            : `${client?.name ?? 'Return'} is ready to file`,
        reason: detail.nextAction.action,
        priority: taxReturn.aiFlagCount > 0 ? 'high' : 'medium',
        dueDate: taxReturn.dueDate,
        ownerId,
        ctaLabel: ctaLabelByCategory[category],
        ctaHref: resolveWorkspaceHref('return', taxReturn.id),
        createdAt: taxReturn.updatedAt,
      })
    })
    .filter((item): item is WorkItem => item !== null)
}

let cachedQueue: WorkItem[] | null = null

/** The full, firm-wide work queue — every actionable item across every
 * return, task, AI flag, and outstanding document request, scored and
 * sorted highest-priority first. Computed once and cached; the underlying
 * mock data doesn't change at runtime. */
export function buildWorkQueue(): WorkItem[] {
  if (cachedQueue) return cachedQueue
  const taskItems = fromTasks()
  const aiItems = fromAISuggestions()
  const docItems = fromDocumentRequests()
  const coveredReturnIds = new Set(taskItems.map((i) => i.returnId).filter((id): id is string => Boolean(id)))
  const returnItems = fromReturnsNeedingAction(coveredReturnIds)

  cachedQueue = [...taskItems, ...aiItems, ...docItems, ...returnItems].sort((a, b) => b.score - a.score)
  return cachedQueue
}

export function getWorkItemsForUser(userId: string): WorkItem[] {
  return buildWorkQueue().filter((item) => item.ownerId === userId)
}

export function getTeamWorkQueue(): WorkItem[] {
  return buildWorkQueue()
}

export function describeDueDate(dueDate: string | undefined): string | undefined {
  if (!dueDate) return undefined
  const days = differenceInCalendarDays(parseISO(dueDate), TODAY)
  if (days < 0) return `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'}`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  return `Due ${parseISO(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
}

export type DueBucket = 'overdue' | 'today' | 'tomorrow' | 'week' | 'later' | 'none'

export function getDueBucket(dueDate: string | undefined): DueBucket {
  if (!dueDate) return 'none'
  const days = differenceInCalendarDays(parseISO(dueDate), TODAY)
  if (days < 0) return 'overdue'
  if (days === 0) return 'today'
  if (days === 1) return 'tomorrow'
  if (days <= 7) return 'week'
  return 'later'
}
