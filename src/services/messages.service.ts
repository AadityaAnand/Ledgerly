import { messageThreads, messages } from '@/mock'
import { mockDelay } from '@/lib/mock-delay'
import type { Message, MessageThread } from '@/types'

export async function fetchMessageThreads(): Promise<MessageThread[]> {
  return mockDelay(messageThreads)
}

export async function fetchThreadMessages(threadId: string): Promise<Message[]> {
  return mockDelay(messages.filter((message) => message.threadId === threadId))
}
