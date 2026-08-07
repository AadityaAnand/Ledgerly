import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Inbox } from 'lucide-react'
import { ConversationListItem } from './conversation-list-item'
import { ConversationFilters } from './conversation-filters'
import { EmptyState } from '@/components/shared/empty-state'
import { staggerContainer } from '@/lib/animations'
import { getClientById } from '@/mock/clients'
import { conversationCategoryMeta } from '@/utils/status'
import type { Conversation, ConversationCategory } from '@/types'

const CATEGORY_ORDER: ConversationCategory[] = [
  'needs_attention',
  'waiting_on_client',
  'internal_review',
  'completed',
]

interface ConversationListPanelProps {
  conversations: Conversation[]
  selectedConversationId: string | null
  onSelect: (id: string) => void
  filters: {
    search: string
    clientId: string | null
    ownerId: string | null
    category: ConversationCategory | null
    documentId: string | null
    unreadOnly: boolean
  }
}

export function ConversationListPanel({
  conversations,
  selectedConversationId,
  onSelect,
  filters,
}: ConversationListPanelProps) {
  const filtered = useMemo(() => {
    const search = filters.search.trim().toLowerCase()
    return conversations.filter((c) => {
      if (filters.clientId && c.clientId !== filters.clientId) return false
      if (filters.ownerId && c.ownerId !== filters.ownerId) return false
      if (filters.category && c.category !== filters.category) return false
      if (filters.documentId && !c.relatedDocumentIds?.includes(filters.documentId)) return false
      if (filters.unreadOnly && c.unreadCount === 0) return false
      if (search) {
        const client = getClientById(c.clientId)
        const haystack = `${c.title} ${client?.name ?? ''} ${c.nextAction}`.toLowerCase()
        if (!haystack.includes(search)) return false
      }
      return true
    })
  }, [conversations, filters])

  const grouped = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      items: filtered
        .filter((c) => c.category === category)
        .sort((a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()),
    })).filter((group) => group.items.length > 0)
  }, [filtered])

  return (
    <div className="flex h-full flex-col">
      <div className="border-border shrink-0 border-b p-3">
        <ConversationFilters conversations={conversations} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No conversations match"
            description="Try adjusting your search or filters."
            className="h-full"
          />
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            {grouped.map((group) => (
              <div key={group.category}>
                <div className="bg-surface border-border-subtle sticky top-0 z-10 flex items-center justify-between border-b px-4 py-2">
                  <h3 className="text-foreground-secondary text-xs font-semibold tracking-wide uppercase">
                    {conversationCategoryMeta[group.category].label}
                  </h3>
                  <span className="text-foreground-tertiary text-xs tabular-nums">{group.items.length}</span>
                </div>
                {group.items.map((conversation) => (
                  <ConversationListItem
                    key={conversation.id}
                    conversation={conversation}
                    isSelected={conversation.id === selectedConversationId}
                    onSelect={() => onSelect(conversation.id)}
                  />
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
