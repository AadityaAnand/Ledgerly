import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { AIBadge } from '@/components/shared/ai-badge'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { getClientById } from '@/mock/clients'
import { getReturnById } from '@/mock/returns'
import { aiSuggestions } from '@/mock/ai-suggestions'
import { useNavigationStore } from '@/store/navigation-store'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { aiSeverityMeta } from '@/utils/status'
import { formatRelativeTime } from '@/utils/format'

export function AIReviewPage() {
  const navigate = useNavigate()
  const resetTrail = useNavigationStore((s) => s.resetTrail)

  const openFlags = useMemo(
    () => [...aiSuggestions].filter((s) => !s.resolved).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    []
  )

  return (
    <PageContainer>
      <PageHeader
        title="AI Review"
        description="Discrepancies, missed deductions, and compliance flags — surfaced automatically across every return."
        actions={<AIBadge label="Powered by AI" />}
      />

      {openFlags.length === 0 ? (
        <EmptyState icon={Sparkles} title="Nothing flagged" description="Every return is clean right now." />
      ) : (
        <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-2">
          {openFlags.map((suggestion) => {
            const taxReturn = getReturnById(suggestion.returnId)
            const client = taxReturn ? getClientById(taxReturn.clientId) : undefined
            return (
              <motion.li key={suggestion.id} variants={staggerItem}>
                <button
                  type="button"
                  onClick={() => {
                    resetTrail()
                    void navigate({ to: '/workspace/$type/$id', params: { type: 'ai_review', id: suggestion.id } })
                  }}
                  className="border-border bg-surface-raised hover:bg-surface-hover focus-visible:-outline-offset-2 flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-colors"
                >
                  <div className="bg-ai-subtle text-ai-subtle-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
                    <Sparkles className="size-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-foreground truncate text-sm font-medium">{suggestion.title}</p>
                      <StatusBadge {...aiSeverityMeta[suggestion.severity]} />
                    </div>
                    <p className="text-foreground-secondary mt-1 line-clamp-2 text-sm leading-relaxed">
                      {suggestion.description}
                    </p>
                    <p className="text-foreground-tertiary mt-2 text-xs">
                      {client?.name} · {taxReturn?.taxYear} {taxReturn?.formType} · {formatRelativeTime(suggestion.createdAt)}
                    </p>
                  </div>
                </button>
              </motion.li>
            )
          })}
        </motion.ul>
      )}
    </PageContainer>
  )
}
