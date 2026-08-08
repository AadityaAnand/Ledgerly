import type { ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { InspectorPanel } from '@/components/shared/inspector-panel'
import { StatusBadge } from '@/components/shared/status-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Timeline } from '@/components/shared/timeline'
import { EmptyState } from '@/components/shared/empty-state'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { resolveWorkspaceHref } from '@/lib/object-graph'
import { documentStatusMeta, taskStatusMeta, conversationCategoryMeta, aiSeverityMeta } from '@/utils/status'
import { workspaceTypeMeta } from '@/features/workspace/workspace-type-meta'
import type { RelatedBundle, WorkspaceObjectSummary } from '@/lib/object-graph'
import type { WorkspaceObjectType } from '@/types'

interface RelationshipPanelProps {
  summary: WorkspaceObjectSummary
  bundle: RelatedBundle
}

function Section({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  if (count === 0) return null
  return (
    <div className="flex flex-col gap-2">
      <p className="text-foreground-tertiary text-[11px] font-semibold tracking-wide uppercase">
        {title} <span className="tabular-nums">({count})</span>
      </p>
      {children}
    </div>
  )
}

export function RelationshipPanel({ summary, bundle }: RelationshipPanelProps) {
  const navigate = useNavigate()

  function go(type: WorkspaceObjectType, id: string) {
    void navigate({ to: resolveWorkspaceHref(type, id) })
  }

  const isEmpty =
    bundle.documents.filter((d) => d.id !== summary.id).length === 0 &&
    bundle.tasks.filter((t) => t.id !== summary.id).length === 0 &&
    bundle.conversations.length === 0 &&
    bundle.questions.filter((q) => q.question.id !== summary.id).length === 0 &&
    bundle.aiSuggestions.filter((s) => s.id !== summary.id).length === 0 &&
    !bundle.reviewer &&
    bundle.timeline.length === 0

  const linkedDocuments = bundle.documents.filter((d) => d.id !== summary.id)
  const openTasks = bundle.tasks.filter((t) => t.id !== summary.id)
  const questions = bundle.questions.filter((q) => q.question.id !== summary.id)
  const aiSuggestions = bundle.aiSuggestions.filter((s) => s.id !== summary.id)

  return (
    <InspectorPanel title="Related" subtitle={bundle.client?.name}>
      {isEmpty ? (
        <EmptyState
          icon={workspaceTypeMeta[summary.type].icon}
          title="Nothing linked yet"
          description="Related documents, tasks, and conversations will show up here."
          className="py-10"
        />
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-6">
          {bundle.taxReturn && (
            <Section title="Related return" count={1}>
              <button
                type="button"
                onClick={() => go('return', bundle.taxReturn!.id)}
                className="border-border-subtle bg-surface-raised hover:bg-surface-hover focus-visible:-outline-offset-2 flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors"
              >
                <span className="text-foreground truncate text-sm font-medium">
                  {bundle.client?.name} — {bundle.taxReturn.formType}
                </span>
                <ChevronRight className="text-foreground-tertiary size-4 shrink-0" aria-hidden="true" />
              </button>
            </Section>
          )}

          <Section title="Linked documents" count={linkedDocuments.length}>
            <ul className="flex flex-col gap-1.5">
              {linkedDocuments.map((doc) => (
                <motion.li key={doc.id} variants={staggerItem}>
                  <button
                    type="button"
                    onClick={() => go('document', doc.id)}
                    className="border-border-subtle bg-surface-raised hover:bg-surface-hover focus-visible:-outline-offset-2 flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors"
                  >
                    <span className="text-foreground min-w-0 flex-1 truncate text-sm">{doc.name}</span>
                    <StatusBadge {...documentStatusMeta[doc.status]} className="shrink-0" />
                  </button>
                </motion.li>
              ))}
            </ul>
          </Section>

          <Section title="Related messages" count={bundle.conversations.length}>
            <ul className="flex flex-col gap-1.5">
              {bundle.conversations.map((conversation) => (
                <motion.li key={conversation.id} variants={staggerItem}>
                  <button
                    type="button"
                    onClick={() => go('conversation', conversation.id)}
                    className="border-border-subtle bg-surface-raised hover:bg-surface-hover focus-visible:-outline-offset-2 flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors"
                  >
                    <span className="text-foreground min-w-0 flex-1 truncate text-sm">{conversation.title}</span>
                    <StatusBadge {...conversationCategoryMeta[conversation.category]} className="shrink-0" />
                  </button>
                </motion.li>
              ))}
            </ul>
          </Section>

          <Section title="Open tasks" count={openTasks.length}>
            <ul className="flex flex-col gap-1.5">
              {openTasks.map((task) => (
                <motion.li key={task.id} variants={staggerItem}>
                  <button
                    type="button"
                    onClick={() => go('task', task.id)}
                    className="border-border-subtle bg-surface-raised hover:bg-surface-hover focus-visible:-outline-offset-2 flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors"
                  >
                    <span className="text-foreground min-w-0 flex-1 truncate text-sm">{task.title}</span>
                    <StatusBadge {...taskStatusMeta[task.status]} className="shrink-0" />
                  </button>
                </motion.li>
              ))}
            </ul>
          </Section>

          <Section title="Questionnaire items" count={questions.length}>
            <ul className="flex flex-col gap-1.5">
              {questions.map(({ question }) => (
                <motion.li key={question.id} variants={staggerItem}>
                  <button
                    type="button"
                    onClick={() => go('question', question.id)}
                    className="border-border-subtle bg-surface-raised hover:bg-surface-hover focus-visible:-outline-offset-2 flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors"
                  >
                    <span className="text-foreground truncate text-sm">{question.question}</span>
                    <ChevronRight className="text-foreground-tertiary size-3.5 shrink-0" aria-hidden="true" />
                  </button>
                </motion.li>
              ))}
            </ul>
          </Section>

          <Section title="AI suggestions" count={aiSuggestions.length}>
            <ul className="flex flex-col gap-1.5">
              {aiSuggestions.map((suggestion) => (
                <motion.li key={suggestion.id} variants={staggerItem}>
                  <button
                    type="button"
                    onClick={() => go('ai_review', suggestion.id)}
                    className="border-border-subtle bg-surface-raised hover:bg-surface-hover focus-visible:-outline-offset-2 flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors"
                  >
                    <span className="text-foreground min-w-0 flex-1 truncate text-sm">{suggestion.title}</span>
                    <StatusBadge {...aiSeverityMeta[suggestion.severity]} className="shrink-0" />
                  </button>
                </motion.li>
              ))}
            </ul>
          </Section>

          {bundle.reviewer && (
            <Section title="Reviewer" count={1}>
              <div className="border-border-subtle flex items-center gap-2.5 rounded-lg border px-3 py-2.5">
                <UserAvatar name={bundle.reviewer.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-foreground truncate text-sm font-medium">{bundle.reviewer.name}</p>
                  <p className="text-foreground-tertiary truncate text-xs">{bundle.reviewer.title}</p>
                </div>
              </div>
            </Section>
          )}

          {bundle.timeline.length > 0 && (
            <Section title="Activity" count={bundle.timeline.length}>
              <Timeline items={bundle.timeline} />
            </Section>
          )}
        </motion.div>
      )}
    </InspectorPanel>
  )
}
