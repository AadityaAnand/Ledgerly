import { Bell, CheckCheck } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/shared/icon-button'
import { EmptyState } from '@/components/shared/empty-state'
import { useNotificationsStore } from '@/store/notifications-store'
import { getUserById } from '@/mock/users'
import { formatRelativeTime } from '@/utils/format'
import { cn } from '@/lib/utils'
import { staggerContainer, staggerItem } from '@/lib/animations'

export function NotificationBell() {
  const notifications = useNotificationsStore((s) => s.notifications)
  const unreadCount = useNotificationsStore((s) => s.unreadCount)
  const markAsRead = useNotificationsStore((s) => s.markAsRead)
  const markAllAsRead = useNotificationsStore((s) => s.markAllAsRead)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <IconButton label="Notifications" showTooltip={false} icon={<Bell className="size-4" />} />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="bg-danger border-background pointer-events-none absolute top-1 right-1 flex size-2 items-center justify-center rounded-full border-2"
              />
            )}
          </AnimatePresence>
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" className="flex max-h-96 w-96 flex-col overflow-hidden p-0">
        <div className="border-border flex shrink-0 items-center justify-between border-b px-4 py-3">
          <p className="text-foreground text-sm font-semibold">Notifications</p>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={markAllAsRead}>
              <CheckCheck className="size-3.5" aria-hidden="true" />
              Mark all read
            </Button>
          )}
        </div>
        {notifications.length === 0 ? (
          <EmptyState icon={Bell} title="You’re all caught up" className="py-10" />
        ) : (
          <ScrollArea className="min-h-0 flex-1">
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col"
            >
              {notifications.map((notification) => {
                const actor = notification.actorId ? getUserById(notification.actorId) : undefined
                return (
                  <motion.li key={notification.id} variants={staggerItem}>
                    <button
                      type="button"
                      onClick={() => markAsRead(notification.id)}
                      className={cn(
                        'hover:bg-surface-hover border-border-subtle flex w-full items-start gap-3 border-b px-4 py-3 text-left last:border-b-0'
                      )}
                    >
                      <span
                        className={cn(
                          'mt-1.5 size-1.5 shrink-0 rounded-full',
                          notification.read ? 'bg-transparent' : 'bg-primary'
                        )}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            'text-sm',
                            notification.read ? 'text-foreground-secondary' : 'text-foreground font-medium'
                          )}
                        >
                          {notification.title}
                        </p>
                        {notification.description && (
                          <p className="text-foreground-tertiary mt-0.5 text-xs">
                            {notification.description}
                          </p>
                        )}
                        <p className="text-foreground-tertiary mt-1 text-xs">
                          {actor ? `${actor.name} · ` : ''}
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                    </button>
                  </motion.li>
                )
              })}
            </motion.ul>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  )
}
