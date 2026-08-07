import type { ID } from './common'

export type ConversationCategory = 'needs_attention' | 'waiting_on_client' | 'internal_review' | 'completed'

export type ConversationPriority = 'low' | 'medium' | 'high' | 'urgent'

export type MessageVisibility = 'client' | 'internal'

export type MessageKind =
  | 'message'
  | 'internal_note'
  | 'ai_suggestion'
  | 'system'
  | 'document_request'
  | 'approval'

export type AISuggestionType =
  | 'suggested_response'
  | 'summary'
  | 'follow_up'
  | 'missing_documents'
  | 'next_action'

export type DocumentRequestStatus = 'waiting_on_client' | 'received' | 'overdue'

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface MessageAttachment {
  id: ID
  name: string
  fileType: 'pdf' | 'image' | 'csv'
  fileSize: number
  /** Links back to the shared document mock, when the attachment is a document already on file. */
  documentId?: ID
}

export interface DocumentRequestInfo {
  id: ID
  documentName: string
  requestedById: ID
  status: DocumentRequestStatus
  dueDate: string
}

export interface ConversationMessage {
  id: ID
  conversationId: ID
  kind: MessageKind
  visibility: MessageVisibility
  /** Undefined for system messages, which render without an author bubble. */
  authorId?: ID
  body: string
  createdAt: string
  attachments?: MessageAttachment[]
  mentionedUserIds?: ID[]
  replyToId?: ID
  pinned?: boolean
  aiSuggestionType?: AISuggestionType
  documentRequest?: DocumentRequestInfo
  approvalStatus?: ApprovalStatus
}

export interface Conversation {
  id: ID
  title: string
  clientId: ID
  category: ConversationCategory
  priority: ConversationPriority
  returnId?: ID
  relatedDocumentIds?: ID[]
  /** TaxFieldTrace ids from the return review workspace, when this thread is about a specific field. */
  relatedFieldIds?: ID[]
  linkedTaskIds?: ID[]
  ownerId: ID
  nextAction: string
  dueDate?: string
  isBlocking?: boolean
  participantIds: ID[]
  unreadCount: number
  lastActivityAt: string
  reviewStatus?: 'pending' | 'in_review' | 'approved'
}
