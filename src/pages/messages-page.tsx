import { useEffect } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { fadeIn } from '@/lib/animations'
import { getClientById } from '@/mock/clients'
import { fetchAllConversationMessages, fetchConversations } from '@/services/collaboration.service'
import { useCollaborationStore } from '@/store/collaboration-store'
import { useBreadcrumbStore } from '@/store/breadcrumb-store'
import { ConversationListPanel } from '@/features/collaboration/components/conversation-list-panel'
import { MessageThreadPanel } from '@/features/collaboration/components/message-thread-panel'
import { ContextInspectorPanel } from '@/features/collaboration/components/context-inspector-panel'
import { CollaborationWorkspaceSkeleton } from '@/features/collaboration/components/collaboration-workspace-skeleton'

export function MessagesPage() {
  const { conversationId } = useParams({ strict: false }) as { conversationId?: string }
  const navigate = useNavigate()

  const conversations = useCollaborationStore((s) => s.conversations)
  const isLoading = useCollaborationStore((s) => s.isLoading)
  const filters = useCollaborationStore((s) => s.filters)
  const selectedConversationId = useCollaborationStore((s) => s.selectedConversationId)
  const initialize = useCollaborationStore((s) => s.initialize)
  const setLoading = useCollaborationStore((s) => s.setLoading)
  const selectConversation = useCollaborationStore((s) => s.selectConversation)

  const setTrailingLabel = useBreadcrumbStore((s) => s.setTrailingLabel)

  useEffect(() => {
    setLoading(true)
    let cancelled = false
    Promise.all([fetchConversations(), fetchAllConversationMessages()]).then(([convos, msgs]) => {
      if (!cancelled) initialize(convos, msgs)
    })
    return () => {
      cancelled = true
    }
  }, [initialize, setLoading])

  useEffect(() => {
    if (conversationId) selectConversation(conversationId)
  }, [conversationId, selectConversation])

  useEffect(() => {
    if (conversationId || isLoading) return
    const first = conversations[0]
    if (first) {
      void navigate({
        to: '/messages/$conversationId',
        params: { conversationId: first.id },
        replace: true,
      })
    }
  }, [conversationId, isLoading, conversations, navigate])

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId)
  const client = selectedConversation ? getClientById(selectedConversation.clientId) : undefined

  useEffect(() => {
    if (!selectedConversation || !client) return
    setTrailingLabel(`${client.name} — ${selectedConversation.title}`)
    return () => setTrailingLabel(null)
  }, [selectedConversation, client, setTrailingLabel])

  const handleSelect = (id: string) => {
    void navigate({ to: '/messages/$conversationId', params: { conversationId: id } })
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="h-full">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="h-full">
              <CollaborationWorkspaceSkeleton />
            </motion.div>
          ) : (
            <motion.div key="ready" variants={fadeIn} initial="hidden" animate="visible" className="h-full">
              <ResizablePanelGroup orientation="horizontal" className="h-full">
                <ResizablePanel defaultSize="26" minSize="20" maxSize="36">
                  <ConversationListPanel
                    conversations={conversations}
                    selectedConversationId={selectedConversationId}
                    onSelect={handleSelect}
                    filters={filters}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="48" minSize="32">
                  <MessageThreadPanel />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="26" minSize="20" maxSize="34">
                  <ContextInspectorPanel />
                </ResizablePanel>
              </ResizablePanelGroup>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
