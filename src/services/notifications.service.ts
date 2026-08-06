import { notifications } from '@/mock'
import { mockDelay } from '@/lib/mock-delay'
import type { Notification } from '@/types'

export async function fetchNotifications(): Promise<Notification[]> {
  return mockDelay(notifications)
}
