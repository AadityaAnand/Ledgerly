import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessagesSquare } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useCollaborationStore } from '@/store/collaboration-store'
import { getUserById } from '@/mock/users'
import { currentUser } from '@/mock/users'
import { fadeIn, staggerContainer } from '@/lib/animations'
import { ThreadHeader } from './thread-header'
import { MessageItem } from './message-item'
import { DateSeparator } from './date-separator'
import { TypingIndicator } from './typing-indicator'
import { AIAssistantBar } from './ai-assistant-bar'
import { MessageComposer } from './message-composer'

function isSameDay(a: string, b: string) {
  const da = new Date(a)
  const db = new Date(b)
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate()
}

export function MessageThreadPanel() {
  const conversations = useCollaborationStore((s) => s.conversations)
  const messages = useCollaborationStore((s) => s.messages)
  const selectedConversationId = useCollaborationStore((s) => s.selectedConversationId)
  const sendMessage = useCollaborationStore((s) => s.sendMessage)

  const [draft, setDraft] = useState<string | undefined>(undefined)
  const [showTyping, setShowTyping] = useState(false)
  const scrollAnchorRef = useRef<HTMLDivElement>(null)

  const conversation = conversations.find((c) => c.id === selectedConversationId)
  const threadMessages = messages
    .filter((m) => m.conversationId === selectedConversationId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ block: 'end' })
  }, [threadMessages.length, selectedConversationId])

  useEffect(() => {
    // Reset the mocked typing indicator whenever the selected conversation changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowTyping(false)
    if (!conversation || conversation.category !== 'waiting_on_client') return
    const owner = getUserById(conversation.ownerId)
    if (!owner || owner.role !== 'client') return
    const showTimer = setTimeout(() => setShowTyping(true), 1200)
    const hideTimer = setTimeout(() => setShowTyping(false), 4200)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [conversation])

  if (!conversation) {
    return (
      <EmptyState
        icon={MessagesSquare}
        title="Select a conversation"
        description="Choose a conversation from the list to see the full thread and its context."
        className="h-full"
      />
    )
  }

  const typingName =
    conversation.category === 'waiting_on_client' ? getUserById(conversation.ownerId)?.name : undefined

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={conversation.id}
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex h-full flex-col"
      >
        <ThreadHeader conversation={conversation} />

        <ScrollArea className="min-h-0 flex-1">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col px-3 py-3"
          >
            {threadMessages.map((message, index) => {
              const previous = threadMessages[index - 1]
              const showDateSeparator = !previous || !isSameDay(previous.createdAt, message.createdAt)
              const replyToMessage = message.replyToId
                ? threadMessages.find((m) => m.id === message.replyToId)
                : undefined

              return (
                <div key={message.id}>
                  {showDateSeparator && <DateSeparator iso={message.createdAt} />}
                  <MessageItem
                    message={message}
                    replyToMessage={replyToMessage}
                    onUseSuggestion={(body) => setDraft(body)}
                  />
                </div>
              )
            })}
            <AnimatePresence>
              {showTyping && typingName && <TypingIndicator name={typingName} />}
            </AnimatePresence>
            <div ref={scrollAnchorRef} />
          </motion.div>
        </ScrollArea>

        <AIAssistantBar />
        <MessageComposer
          draft={draft}
          onDraftConsumed={() => setDraft(undefined)}
          onSend={(body, visibility) => sendMessage(conversation.id, body, visibility, currentUser.id)}
        />
      </motion.div>
    </AnimatePresence>
  )
}
