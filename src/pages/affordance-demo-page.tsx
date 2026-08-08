import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { SectionHeader } from '@/components/layout/section-header'
import {
  AIGeneratedField,
  ClickableField,
  EditableField,
  LockedField,
  NeedsApprovalField,
  ReadOnlyField,
  VerifiedField,
} from '@/components/shared/field-affordance'
import { resolveWorkspaceHref } from '@/lib/object-graph'
import { useActiveRoleUser } from '@/hooks/use-role'
import { formatCurrency } from '@/utils/format'

const cardClass = 'border-border bg-surface-raised rounded-xl border p-5'

/**
 * A dedicated reference workspace for the clickable-vs-editable affordance
 * system. Nothing here is unique to this page — every component is the
 * same one used in the return workspace, the document list, the dashboard,
 * and the client experience. See `src/components/shared/field-affordance/`.
 */
export function AffordanceDemoPage() {
  const navigate = useNavigate()
  const currentUser = useActiveRoleUser()

  const [incomeVerified, setIncomeVerified] = useState(false)
  const [charitable, setCharitable] = useState('7,500')
  const [deduction, setDeduction] = useState('1,200')

  return (
    <PageContainer>
      <PageHeader
        title="Clickable vs. Editable"
        description="The shared interaction language behind every field in Ledgerly — what you can click, edit, verify, approve, or can't change, and why."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className={cardClass}>
          <SectionHeader title="2025 Individual Return" description="Bennett Design Studio · Form 1120-S" />
          <div className="mt-4 flex flex-col divide-y divide-border-subtle">
            {incomeVerified ? (
              <VerifiedField
                label="Income"
                value={formatCurrency(128450)}
                verification={{
                  reviewerName: currentUser.name,
                  reviewerAvatarUrl: currentUser.avatarUrl,
                  timestamp: new Date().toISOString(),
                  sourceLabel: 'W-2 • Page 1',
                  history: [{ actorName: 'Ledgerly AI', action: 'extracted this value', timestamp: '2026-07-19T09:30:00.000Z' }],
                }}
              />
            ) : (
              <AIGeneratedField
                label="Income"
                value={formatCurrency(128450)}
                ai={{
                  confidence: 96,
                  sourceLabel: 'W-2 • Page 1',
                  reasoning: 'Matched Box 1 and verified employer information.',
                }}
                onViewSource={() => toast('Opening W-2 • Page 1…')}
                onEditFromAI={() => toast('Switching to manual edit isn’t wired up in this demo.')}
                onMarkVerified={() => {
                  setIncomeVerified(true)
                  toast.success('Income marked as verified')
                }}
              />
            )}

            <VerifiedField
              label="Mortgage Interest"
              value={formatCurrency(18420)}
              verification={{
                reviewerName: 'Sarah Chen',
                timestamp: '2026-08-01T14:20:00.000Z',
                sourceLabel: 'Form 1098 • Page 1',
              }}
            />

            <EditableField
              label="Charitable Contributions"
              value={formatCurrency(Number(charitable.replace(/,/g, '')))}
              editValue={charitable}
              inputType="text"
              validate={(v) => (Number(v.replace(/,/g, '')) > 0 ? undefined : 'Enter an amount greater than zero.')}
              onSave={async (v) => {
                await new Promise((r) => setTimeout(r, 500))
                setCharitable(v)
              }}
            />

            <EditableField
              label="Additional Deduction (try an invalid value)"
              value={formatCurrency(Number(deduction.replace(/,/g, '')))}
              editValue={deduction}
              helperText="Type letters and save to see the error state."
              validate={(v) => (/^[\d,]+$/.test(v) ? undefined : 'Enter a valid dollar amount.')}
              onSave={async (v) => {
                await new Promise((r) => setTimeout(r, 400))
                setDeduction(v)
              }}
            />

            <NeedsApprovalField
              label="Estimated Tax"
              value={formatCurrency(22180)}
              approval={{ reason: 'AI confidence fell below the review threshold.', confidence: 71 }}
              onReview={() => toast('Opening review…')}
            />

            <LockedField
              label="Filed Return"
              value={formatCurrency(45210)}
              locked={{ reason: 'This value cannot be changed because the return has been filed.' }}
            />

            <EditableField
              label="Final Review Adjustment"
              value={formatCurrency(0)}
              editValue="0"
              requiredPermission="APPROVE_RETURN"
              deniedReason="Only a reviewer can modify this field."
              onSave={async () => {
                await new Promise((r) => setTimeout(r, 400))
                toast.success('Adjustment saved')
              }}
            />

            <ReadOnlyField label="Filing Status" value="Married Filing Jointly" helperText="Set during intake — not editable here." />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className={cardClass}>
            <SectionHeader title="Clickable references" description="Open the related object directly" />
            <div className="mt-4 flex flex-col divide-y divide-border-subtle">
              <ClickableField
                label="Source document"
                value="W-2 — Bennett Design Studio.pdf"
                onOpen={() => void navigate({ to: resolveWorkspaceHref('document', 'doc_1') })}
              />
              <ClickableField
                label="Client"
                value="Bennett Design Studio"
                onOpen={() => void navigate({ to: resolveWorkspaceHref('client', 'cli_1') })}
              />
              <ClickableField
                label="Related task"
                value="Resolve flagged 1099-NEC discrepancy"
                onOpen={() => void navigate({ to: resolveWorkspaceHref('task', 'task_1') })}
              />
              <ClickableField
                label="Return"
                value="2025 1120-S"
                onOpen={() => void navigate({ to: resolveWorkspaceHref('return', 'ret_1') })}
              />
            </div>
          </div>

          <div className={cardClass}>
            <SectionHeader title="Low confidence & overrides" description="Edge cases worth seeing on their own" />
            <div className="mt-4 flex flex-col divide-y divide-border-subtle">
              <AIGeneratedField
                label="Rental Income"
                value={formatCurrency(18000)}
                ai={{
                  confidence: 54,
                  sourceLabel: 'Schedule E • Line 3',
                  reasoning: 'Figure derived from a low-resolution scan — worth a manual check.',
                }}
                onViewSource={() => toast('Opening Schedule E • Page 1…')}
                onMarkVerified={() => toast.success('Rental Income marked as verified')}
              />
              <VerifiedField
                label="Capital Gains (manually overridden)"
                value={formatCurrency(12650)}
                helperText="Manually overridden — AI originally extracted $11,900"
                verification={{
                  reviewerName: 'Marcus Webb',
                  timestamp: '2026-08-02T10:00:00.000Z',
                  sourceLabel: 'Schedule D • Line 16',
                }}
              />
              <LockedField
                label="Prior-Year AGI"
                value={formatCurrency(96200)}
                locked={{
                  reason: 'Carried forward from the accepted 2024 return.',
                  unlockHint: 'Contact your reviewer if this needs a correction.',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
