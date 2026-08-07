import { create } from 'zustand'
import type { Conversation, ConversationCategory, ConversationMessage, MessageVisibility } from '@/types'

export interface CollaborationFilters {
  search: string
  clientId: string | null
  ownerId: string | null
  category: ConversationCategory | null
  documentId: string | null
  unreadOnly: boolean
}

const emptyFilters: CollaborationFilters = {
  search: '',
  clientId: null,
  ownerId: null,
  category: null,
  documentId: null,
  unreadOnly: false,
}

let messageSeq = 0
function nextMessageId() {
  messageSeq += 1
  return `msg_session_${messageSeq}`
}

interface CollaborationState {
  conversations: Conversation[]
  messages: ConversationMessage[]
  isLoading: boolean
  selectedConversationId: string | null
  filters: CollaborationFilters

  initialize: (conversations: Conversation[], messages: ConversationMessage[]) => void
  setLoading: (loading: boolean) => void
  selectConversation: (id: string | null) => void
  setFilter: <K extends keyof CollaborationFilters>(key: K, value: CollaborationFilters[K]) => void
  clearFilters: () => void

  sendMessage: (conversationId: string, body: string, visibility: MessageVisibility, authorId: string) => void
  markRequestReceived: (messageId: string) => void
  sendReminder: (messageId: string) => void
}

export const useCollaborationStore = create<CollaborationState>()((set, get) => ({
  conversations: [],
  messages: [],
  isLoading: true,
  selectedConversationId: null,
  filters: emptyFilters,

  initialize: (conversations, messages) => set({ conversations, messages, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),

  selectConversation: (id) =>
    set((state) => ({
      selectedConversationId: id,
      conversations: state.conversations.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
    })),

  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  clearFilters: () => set({ filters: emptyFilters }),

  sendMessage: (conversationId, body, visibility, authorId) => {
    const now = new Date().toISOString()
    const message: ConversationMessage = {
      id: nextMessageId(),
      conversationId,
      kind: 'message',
      visibility,
      authorId,
      body,
      createdAt: now,
    }
    set((state) => ({
      messages: [...state.messages, message],
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, lastActivityAt: now } : c
      ),
    }))
  },

  markRequestReceived: (messageId) => {
    const target = get().messages.find((m) => m.id === messageId)
    if (!target?.documentRequest) return
    const now = new Date().toISOString()
    const systemMessage: ConversationMessage = {
      id: nextMessageId(),
      conversationId: target.conversationId,
      kind: 'system',
      visibility: 'internal',
      body: `“${target.documentRequest.documentName}” marked as received`,
      createdAt: now,
    }
    set((state) => ({
      messages: [
        ...state.messages.map((m) =>
          m.id === messageId && m.documentRequest
            ? { ...m, documentRequest: { ...m.documentRequest, status: 'received' as const } }
            : m
        ),
        systemMessage,
      ],
      conversations: state.conversations.map((c) =>
        c.id === target.conversationId ? { ...c, lastActivityAt: now } : c
      ),
    }))
  },

  sendReminder: (messageId) => {
    const target = get().messages.find((m) => m.id === messageId)
    if (!target?.documentRequest) return
    const now = new Date().toISOString()
    const systemMessage: ConversationMessage = {
      id: nextMessageId(),
      conversationId: target.conversationId,
      kind: 'system',
      visibility: 'internal',
      body: `Reminder sent for “${target.documentRequest.documentName}”`,
      createdAt: now,
    }
    set((state) => ({
      messages: [...state.messages, systemMessage],
      conversations: state.conversations.map((c) =>
        c.id === target.conversationId ? { ...c, lastActivityAt: now } : c
      ),
    }))
  },
}))
