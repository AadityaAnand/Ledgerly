import { getClientById } from '@/mock/clients'
import { getReturnById } from '@/mock/returns'
import { getUserById } from '@/mock/users'
import { getDocumentById, getDocumentsByClientId, getDocumentsByReturnId } from '@/mock/documents'
import { getTaskById, getTasksByClientId, getTasksByReturnId } from '@/mock/tasks'
import {
  getConversationById,
  getConversationsByClientId,
  getConversationsByReturnId,
} from '@/mock/conversations'
import { getAISuggestionById, getAISuggestionsByReturnId } from '@/mock/ai-suggestions'
import { getOnboardingProfileByReturnId, getQuestionById } from '@/mock/onboarding'
import { getReviewHistoryByReturnId } from '@/mock/review-history'
import { aiSeverityMeta, documentStatusMeta, taskStatusMeta, type StatusMeta } from '@/utils/status'
import { formatFileSize } from '@/utils/format'
import type { TimelineItem } from '@/components/shared/timeline'
import type {
  AISuggestion,
  ClientOnboardingProfile,
  Client,
  Conversation,
  Document,
  QuestionnaireQuestion,
  Task,
  TaxReturn,
  WorkspaceObjectType,
} from '@/types'

export interface WorkspaceObjectSummary {
  type: WorkspaceObjectType
  id: string
  title: string
  subtitle?: string
  body?: string
  status?: StatusMeta
  clientId?: string
  returnId?: string
  ownerId?: string
}

/** Resolves the standalone generic workspace types (document, task, client,
 * ai_review, question). Return and conversation have their own dedicated,
 * richer pages (Ch1 traceability / Ch2 messages) and don't route through
 * here — see `resolveWorkspaceHref`. */
export function getWorkspaceObject(type: WorkspaceObjectType, id: string): WorkspaceObjectSummary | undefined {
  switch (type) {
    case 'document': {
      const doc = getDocumentById(id)
      if (!doc) return undefined
      return {
        type,
        id,
        title: doc.name,
        subtitle: `${formatFileSize(doc.fileSize)} · uploaded by ${getUserById(doc.uploadedById)?.name ?? 'Unknown'}`,
        status: documentStatusMeta[doc.status],
        clientId: doc.clientId,
        returnId: doc.returnId,
      }
    }
    case 'task': {
      const task = getTaskById(id)
      if (!task) return undefined
      return {
        type,
        id,
        title: task.title,
        subtitle: task.description,
        body: task.dueDate ? `Due ${task.dueDate}` : undefined,
        status: taskStatusMeta[task.status],
        clientId: task.clientId,
        returnId: task.returnId,
        ownerId: task.assigneeId,
      }
    }
    case 'client': {
      const client = getClientById(id)
      if (!client) return undefined
      return {
        type,
        id,
        title: client.name,
        subtitle: client.entityType,
        clientId: client.id,
        ownerId: client.primaryPreparerId,
      }
    }
    case 'ai_review': {
      const suggestion = getAISuggestionById(id)
      if (!suggestion) return undefined
      const taxReturn = getReturnById(suggestion.returnId)
      return {
        type,
        id,
        title: suggestion.title,
        subtitle: suggestion.description,
        status: aiSeverityMeta[suggestion.severity],
        clientId: taxReturn?.clientId,
        returnId: suggestion.returnId,
      }
    }
    case 'question': {
      const found = getQuestionById(id)
      if (!found) return undefined
      return {
        type,
        id,
        title: found.question.question,
        subtitle: found.question.helpText,
        clientId: found.profile.clientId,
        returnId: found.profile.returnId,
      }
    }
    default:
      return undefined
  }
}

export interface RelatedBundle {
  client?: Client
  taxReturn?: TaxReturn
  documents: Document[]
  tasks: Task[]
  conversations: Conversation[]
  questions: { question: QuestionnaireQuestion; profile: ClientOnboardingProfile }[]
  aiSuggestions: AISuggestion[]
  reviewer?: ReturnType<typeof getUserById>
  owner?: ReturnType<typeof getUserById>
  timeline: TimelineItem[]
}

/** Everything connected to the current object — the data behind the
 * Relationship Panel. Scoped to the object's return when it has one
 * (the tightest, most relevant context), falling back to client-wide. */
export function getRelatedBundle(summary: WorkspaceObjectSummary): RelatedBundle {
  const client = summary.clientId ? getClientById(summary.clientId) : undefined
  const taxReturn = summary.returnId ? getReturnById(summary.returnId) : undefined

  const documents = summary.returnId
    ? getDocumentsByReturnId(summary.returnId)
    : summary.clientId
      ? getDocumentsByClientId(summary.clientId)
      : []

  const tasks = summary.returnId
    ? getTasksByReturnId(summary.returnId)
    : summary.clientId
      ? getTasksByClientId(summary.clientId)
      : []

  const conversations = summary.returnId
    ? getConversationsByReturnId(summary.returnId)
    : summary.clientId
      ? getConversationsByClientId(summary.clientId)
      : []

  const onboardingProfile = summary.returnId ? getOnboardingProfileByReturnId(summary.returnId) : undefined
  const questions = onboardingProfile ? onboardingProfile.questionnaireQuestions.map((question) => ({ question, profile: onboardingProfile })) : []

  const aiSuggestions = summary.returnId ? getAISuggestionsByReturnId(summary.returnId) : []

  const reviewHistory = summary.returnId ? getReviewHistoryByReturnId(summary.returnId) : []
  const timeline: TimelineItem[] = [
    ...reviewHistory.map((entry) => {
      const actor = getUserById(entry.reviewerId)
      const verb =
        entry.decision === 'approved'
          ? 'approved the return'
          : entry.decision === 'changes_requested'
            ? 'requested changes'
            : 'commented on the return'
      return {
        id: entry.id,
        actorName: actor?.name ?? 'Someone',
        actorAvatarUrl: actor?.avatarUrl,
        action: verb,
        timestamp: entry.createdAt,
      }
    }),
    ...documents.map((doc) => {
      const actor = getUserById(doc.uploadedById)
      return {
        id: `doc-${doc.id}`,
        actorName: actor?.name ?? 'Someone',
        actorAvatarUrl: actor?.avatarUrl,
        action: `uploaded “${doc.name}”`,
        timestamp: doc.uploadedAt,
      }
    }),
  ]
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
    .slice(0, 6)

  return {
    client,
    taxReturn,
    documents,
    tasks,
    conversations,
    questions,
    aiSuggestions,
    reviewer: taxReturn?.assignedReviewerId ? getUserById(taxReturn.assignedReviewerId) : undefined,
    owner: summary.ownerId ? getUserById(summary.ownerId) : undefined,
    timeline,
  }
}

/** Single source of truth for where a workspace object type actually lives —
 * Returns and Conversations already have dedicated, richer pages. */
export function resolveWorkspaceHref(type: WorkspaceObjectType, id: string): string {
  if (type === 'return') return `/returns/${id}`
  if (type === 'conversation') return `/messages/${id}`
  return `/workspace/${type}/${id}`
}

export { getConversationById, getReturnById }
