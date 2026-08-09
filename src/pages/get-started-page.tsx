import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { Timeline } from '@/components/shared/timeline'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { StageBadge, ConditionBadge } from '@/features/return-status/components/stage-badge'
import { ReturnStatusPanel } from '@/features/return-status/components/return-status-panel'
import { staggerItem } from '@/lib/animations'
import { getEffectiveReturnStatus } from '@/lib/return-lifecycle'
import { conversations } from '@/mock/conversations'
import { getClientById } from '@/mock/clients'
import { getDocumentsByClientId } from '@/mock/documents'
import { getReturnById, getReturnsByClientId } from '@/mock/returns'
import { getUserById } from '@/mock/users'
import { documentStatusMeta } from '@/utils/status'
import { fetchOnboardingProfile } from '@/services/onboarding.service'
import { useOnboardingStore } from '@/store/onboarding-store'
import { WelcomeHero } from '@/features/onboarding/components/welcome-hero'
import { NextActionCard } from '@/features/onboarding/components/next-action-card'
import { CompletionCelebration } from '@/features/onboarding/components/completion-celebration'
import { OnboardingChecklist } from '@/features/onboarding/components/onboarding-checklist'
import { DocumentsPanel } from '@/features/onboarding/components/documents-panel'
import { QuestionnaireTeaser } from '@/features/onboarding/components/questionnaire-teaser'
import { DeadlinesPanel } from '@/features/onboarding/components/deadlines-panel'
import { MessagesTeaser } from '@/features/onboarding/components/messages-teaser'
import { HelpSupportPanel } from '@/features/onboarding/components/help-support-panel'

const cardClass = 'border-border bg-surface-raised rounded-xl border p-5'

interface GetStartedPageProps {
  /** Which client's onboarding/return workspace to show. Defaults to the
   * demo client so the standalone `/get-started` route is unaffected — the
   * active workspace passes its own clientId so the same page serves the
   * Client and Business Owner roles. */
  clientId?: string
}

export function GetStartedPage({ clientId = 'cli_8' }: GetStartedPageProps) {
  const profile = useOnboardingStore((s) => s.profile)
  const uploadedDocuments = useOnboardingStore((s) => s.uploadedDocuments)
  const isLoading = useOnboardingStore((s) => s.isLoading)
  const completingStepId = useOnboardingStore((s) => s.completingStepId)
  const initialize = useOnboardingStore((s) => s.initialize)
  const setLoading = useOnboardingStore((s) => s.setLoading)
  const completeStep = useOnboardingStore((s) => s.completeStep)

  useEffect(() => {
    setLoading(true)
    let cancelled = false
    fetchOnboardingProfile(clientId).then((data) => {
      if (cancelled) return
      if (data) {
        initialize(data, getDocumentsByClientId(clientId))
      } else {
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [clientId, initialize, setLoading])

  const client = getClientById(clientId)
  const firstName = client?.name.split(' ')[0] ?? 'there'
  const primaryReturn = getReturnsByClientId(clientId)[0]
  const taxReturn = profile ? (getReturnById(profile.returnId) ?? primaryReturn) : primaryReturn
  const preparer = taxReturn ? getUserById(taxReturn.assignedPreparerId) : undefined
  const returnStatus = taxReturn ? getEffectiveReturnStatus(taxReturn) : undefined

  const completedSteps = useMemo(() => profile?.steps.filter((s) => s.status === 'complete') ?? [], [profile])
  const totalSteps = profile?.steps.length ?? 0
  const currentStep = useMemo(() => profile?.steps.find((s) => s.status === 'upcoming'), [profile])
  const currentAction = useMemo(
    () => profile?.nextActions.find((a) => a.stepId === currentStep?.id),
    [profile, currentStep]
  )
  const estimatedMinutesRemaining = useMemo(() => {
    if (!profile) return 0
    const upcomingIds = new Set(profile.steps.filter((s) => s.status === 'upcoming').map((s) => s.id))
    return profile.nextActions
      .filter((a) => upcomingIds.has(a.stepId))
      .reduce((sum, a) => sum + a.estimatedMinutes, 0)
  }, [profile])

  const missingDocuments = useMemo(
    () => profile?.requiredDocuments.filter((d) => d.status === 'missing') ?? [],
    [profile]
  )

  const visibleDeadlines = useMemo(
    () => profile?.deadlines.filter((d) => d.kind !== 'documents' || missingDocuments.length > 0) ?? [],
    [profile, missingDocuments]
  )

  const clientConversations = useMemo(
    () =>
      conversations
        .filter((c) => c.clientId === clientId)
        .sort((a, b) => (a.lastActivityAt < b.lastActivityAt ? 1 : -1)),
    [clientId]
  )

  const activityItems = useMemo(
    () =>
      completedSteps
        .filter((s) => s.completedAt)
        .sort((a, b) => (a.completedAt! < b.completedAt! ? 1 : -1))
        .map((s) => ({
          id: s.id,
          actorName: firstName,
          action: `completed “${s.label}”`,
          timestamp: s.completedAt!,
        })),
    [completedSteps, firstName]
  )

  if (isLoading || !client) {
    return (
      <PageContainer>
        <div className="border-border bg-surface-raised h-32 animate-pulse rounded-2xl border" />
        <div className="border-border bg-surface-raised h-64 animate-pulse rounded-2xl border" />
      </PageContainer>
    )
  }

  const returnLabel = taxReturn
    ? `${taxReturn.taxYear} ${client.type === 'business' ? 'Business' : 'Personal'} Tax Return · Form ${taxReturn.formType}`
    : 'Your tax return'

  // A client with no onboarding checklist (already past first-time setup) —
  // the return lifecycle status is the whole story for them.
  if (!profile) {
    const documents = getDocumentsByClientId(clientId)
    return (
      <PageContainer>
        <WelcomeHero
          firstName={firstName}
          returnLabel={returnLabel}
          percentComplete={taxReturn?.progress ?? 0}
          statusLabel={returnStatus ? returnStatus.nextAction.action : 'All caught up'}
        />

        {taxReturn && (
          <div className={cardClass}>
            <ReturnStatusPanel taxReturn={taxReturn} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className={cardClass}>
            <SectionHeader title="Documents" />
            <div className="mt-4">
              {documents.length === 0 ? (
                <EmptyState icon={CheckCircle2} title="No documents yet" className="py-8" />
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {documents.map((doc) => (
                    <li
                      key={doc.id}
                      className="border-border-subtle flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5"
                    >
                      <span className="text-foreground truncate text-sm">{doc.name}</span>
                      <StatusBadge {...documentStatusMeta[doc.status]} className="shrink-0" />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className={cardClass}>
            <SectionHeader title="Messages" />
            <div className="mt-4">
              <MessagesTeaser conversations={clientConversations} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <SectionHeader title="Help & support" />
          <div className="mt-4">
            <HelpSupportPanel cpaName={preparer?.name ?? 'your CPA'} />
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <WelcomeHero
        firstName={firstName}
        returnLabel={returnLabel}
        percentComplete={Math.round((completedSteps.length / (totalSteps || 1)) * 100)}
        estimatedMinutesRemaining={estimatedMinutesRemaining}
        statusLabel={currentAction ? `Waiting on you: ${currentAction.title}` : 'All caught up'}
      />

      {returnStatus && (
        <motion.div
          variants={staggerItem}
          initial="hidden"
          animate="visible"
          className={cardClass + ' flex items-center justify-between gap-3'}
        >
          <div className="flex items-center gap-2">
            <StageBadge stage={returnStatus.stage} />
            {returnStatus.condition && <ConditionBadge condition={returnStatus.condition} />}
          </div>
          <span className="text-foreground-tertiary text-xs">Return status</span>
        </motion.div>
      )}

      {currentAction ? (
        <NextActionCard
          action={currentAction}
          isCompleting={completingStepId === currentAction.stepId}
          onComplete={() => {
            completeStep(currentAction.stepId)
            toast(`${currentAction.ctaLabel} — done!`)
          }}
        />
      ) : (
        <CompletionCelebration />
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-2">
          <div className={cardClass}>
            <SectionHeader title="Your checklist" description="Everything needed to finish your return" />
            <div className="mt-4">
              <OnboardingChecklist steps={profile.steps} currentStepId={currentStep?.id} />
            </div>
          </div>

          <div className={cardClass}>
            <SectionHeader title="Documents" description="Upload from here or from the action above" />
            <div className="mt-4">
              <DocumentsPanel
                uploadedDocuments={uploadedDocuments}
                missingDocuments={missingDocuments}
                completingStepId={completingStepId}
                onUpload={(stepId) => completeStep(stepId)}
              />
            </div>
          </div>

          <div className={cardClass}>
            <SectionHeader
              title={client.type === 'business' ? 'Business questionnaire' : 'Tax questionnaire'}
              description="A few quick questions — answer at your own pace"
            />
            <div className="mt-4">
              <QuestionnaireTeaser
                questions={profile.questionnaireQuestions}
                onContinue={() => toast('The full questionnaire isn’t available yet.')}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className={cardClass}>
            <SectionHeader title="Upcoming deadlines" />
            <div className="mt-4">
              <DeadlinesPanel deadlines={visibleDeadlines} />
            </div>
          </div>

          <div className={cardClass}>
            <SectionHeader title="Recent activity" />
            <div className="mt-4">
              {activityItems.length === 0 ? (
                <EmptyState
                  icon={CheckCircle2}
                  title="No completed tasks yet"
                  description="Your progress will show up here as you go."
                  className="py-8"
                />
              ) : (
                <Timeline items={activityItems} />
              )}
            </div>
          </div>

          <div className={cardClass}>
            <SectionHeader title="Messages" />
            <div className="mt-4">
              <MessagesTeaser conversations={clientConversations} />
            </div>
          </div>

          <div className={cardClass}>
            <SectionHeader title="Help & support" />
            <div className="mt-4">
              <HelpSupportPanel cpaName={preparer?.name ?? 'your CPA'} />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
