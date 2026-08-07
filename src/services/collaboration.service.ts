import { conversationMessages, conversations, getMessagesByConversationId } from '@/mock'
import { mockDelay } from '@/lib/mock-delay'
import type { Conversation, ConversationMessage } from '@/types'

export async function fetchConversations(): Promise<Conversation[]> {
  return mockDelay(conversations, 400)
}

export async function fetchConversationMessages(conversationId: string): Promise<ConversationMessage[]> {
  return mockDelay(getMessagesByConversationId(conversationId), 300)
}

export async function fetchAllConversationMessages(): Promise<ConversationMessage[]> {
  return mockDelay(conversationMessages, 400)
}
