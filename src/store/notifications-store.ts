import { create } from 'zustand'
import { notifications as seedNotifications } from '@/mock'
import type { Notification } from '@/types'

interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

function countUnread(notifications: Notification[]) {
  return notifications.filter((n) => !n.read).length
}

export const useNotificationsStore = create<NotificationsState>()((set) => ({
  notifications: seedNotifications,
  unreadCount: countUnread(seedNotifications),
  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      return { notifications, unreadCount: countUnread(notifications) }
    }),
  markAllAsRead: () =>
    set((state) => {
      const notifications = state.notifications.map((n) => ({ ...n, read: true }))
      return { notifications, unreadCount: 0 }
    }),
}))
