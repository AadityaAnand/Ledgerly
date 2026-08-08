import {
  CheckCircle2,
  CircleDashed,
  FileCheck2,
  FileSearch,
  FileText,
  PenLine,
  UserCheck,
  type LucideIcon,
} from 'lucide-react'
import { getReturnStatusDetail } from '@/mock/return-status'
import type { ReturnCondition, ReturnStage, ReturnStatus, ReturnStatusDetail, StageDefinition, TaxReturn } from '@/types'

/**
 * The single source of truth for the return lifecycle. Every status label,
 * description, and ordering in the product should come from this file —
 * nothing should hardcode stage strings elsewhere.
 */
export const RETURN_STAGES: StageDefinition[] = [
  {
    stage: 'information_needed',
    position: 1,
    label: 'Information Needed',
    clientDescription: 'We need a few details from you to get started.',
    staffDescription: 'Awaiting initial client information or engagement details.',
    defaultOwnerType: 'client',
    allowedNext: ['documents_collected'],
  },
  {
    stage: 'documents_collected',
    position: 2,
    label: 'Documents Collected',
    clientDescription: "We're gathering the documents we need from you.",
    staffDescription: 'Required source documents are being collected from the client.',
    defaultOwnerType: 'client',
    allowedNext: ['preparing_return'],
  },
  {
    stage: 'preparing_return',
    position: 3,
    label: 'Preparing Return',
    clientDescription: 'Your CPA is preparing your return.',
    staffDescription: 'Return is being prepared from the source documents on file.',
    defaultOwnerType: 'cpa',
    allowedNext: ['cpa_review'],
  },
  {
    stage: 'cpa_review',
    position: 4,
    label: 'CPA Review',
    clientDescription: 'Your return is being reviewed.',
    staffDescription: 'Return is in internal review before it goes back to the client.',
    defaultOwnerType: 'cpa',
    allowedNext: ['client_review'],
  },
  {
    stage: 'client_review',
    position: 5,
    label: 'Client Review',
    clientDescription: 'Review your completed return.',
    staffDescription: 'Awaiting the client to review and sign off on the prepared return.',
    defaultOwnerType: 'client',
    allowedNext: ['ready_to_file'],
  },
  {
    stage: 'ready_to_file',
    position: 6,
    label: 'Ready to File',
    clientDescription: 'Your return is ready to file.',
    staffDescription: 'Return is finalized and ready for e-file.',
    defaultOwnerType: 'cpa',
    allowedNext: ['filed'],
  },
  {
    stage: 'filed',
    position: 7,
    label: 'Filed',
    clientDescription: 'Your return has been filed.',
    staffDescription: 'Return has been filed with the IRS.',
    defaultOwnerType: 'cpa',
    allowedNext: [],
  },
]

/** The six-step active journey shown in the timeline — "Filed" is the
 * terminal outcome shown as a separate confirmation, not a 7th node. */
export const TIMELINE_STAGES = RETURN_STAGES.filter((s) => s.stage !== 'filed')
export const TOTAL_ACTIVE_STEPS = TIMELINE_STAGES.length

export const stageIcons: Record<ReturnStage, LucideIcon> = {
  information_needed: CircleDashed,
  documents_collected: FileText,
  preparing_return: FileSearch,
  cpa_review: UserCheck,
  client_review: PenLine,
  ready_to_file: FileCheck2,
  filed: CheckCircle2,
}

export function getStageDefinition(stage: ReturnStage): StageDefinition {
  return RETURN_STAGES.find((s) => s.stage === stage)!
}

export const conditionLabels: Record<ReturnCondition, string> = {
  blocked: 'Blocked',
  needs_attention: 'Needs Attention',
  waiting_on_client: 'Waiting on Client',
  waiting_on_cpa: 'Waiting on CPA',
}

/** Bridges the coarser legacy `ReturnStatus` field (used throughout
 * Challenges 1–5) to the richer stage model, for the handful of returns
 * that don't have an explicit `ReturnStatusDetail` mock entry. */
function mapLegacyStatusToStage(status: ReturnStatus): { stage: ReturnStage; condition?: ReturnCondition } {
  switch (status) {
    case 'not_started':
      return { stage: 'information_needed' }
    case 'gathering_documents':
      return { stage: 'documents_collected' }
    case 'needs_client_info':
      return { stage: 'documents_collected', condition: 'waiting_on_client' }
    case 'in_preparation':
      return { stage: 'preparing_return' }
    case 'in_review':
      return { stage: 'cpa_review' }
    case 'ready_to_file':
      return { stage: 'ready_to_file' }
    case 'filed':
    case 'accepted':
    case 'rejected':
      return { stage: 'filed' }
  }
}

/** The single entry point the rest of the app should use to get a return's
 * full status detail — returns the explicit mock override when one exists,
 * otherwise derives a minimal-but-honest fallback from the legacy status
 * field so every return in the system remains understandable. */
export function getEffectiveReturnStatus(taxReturn: TaxReturn): ReturnStatusDetail {
  const explicit = getReturnStatusDetail(taxReturn.id)
  if (explicit) return explicit

  const { stage, condition } = mapLegacyStatusToStage(taxReturn.status)
  const definition = getStageDefinition(stage)
  return {
    returnId: taxReturn.id,
    stage,
    condition,
    activity: [],
    nextAction: {
      action: definition.staffDescription,
      ownerId: taxReturn.assignedPreparerId,
      ctaLabel: 'View details',
      ctaType: 'return',
      ctaId: taxReturn.id,
    },
    updatedAt: taxReturn.updatedAt,
  }
}
