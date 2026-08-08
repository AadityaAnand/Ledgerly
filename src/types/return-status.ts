import type { ID } from './common'
import type { WorkspaceObjectType } from './navigation'

/** The single shared lifecycle every return moves through — the same six
 * checkpoints a client and a CPA both look at, just with different amounts
 * of detail. "Filed" is the terminal outcome after the six active steps,
 * not counted in "Step X of 6" language. */
export type ReturnStage =
  | 'information_needed'
  | 'documents_collected'
  | 'preparing_return'
  | 'cpa_review'
  | 'client_review'
  | 'ready_to_file'
  | 'filed'

/** An orthogonal condition that can overlay whatever stage a return is
 * currently at — e.g. a return can be in `cpa_review` AND `blocked` at the
 * same time. Absent means nothing exceptional is going on. */
export type ReturnCondition = 'blocked' | 'needs_attention' | 'waiting_on_client' | 'waiting_on_cpa'

export type ReturnOwnerType = 'client' | 'cpa'

export type BlockerSeverity = 'info' | 'warning' | 'danger'

export interface StageDefinition {
  stage: ReturnStage
  /** 1-indexed position in the primary lifecycle. */
  position: number
  label: string
  clientDescription: string
  staffDescription: string
  defaultOwnerType: ReturnOwnerType
  allowedNext: ReturnStage[]
}

export interface ReturnBlocker {
  reason: string
  severity: BlockerSeverity
  detail?: string
}

export interface ReturnNextAction {
  action: string
  ownerId: ID
  dueDate?: string
  ctaLabel: string
  /** Where the CTA should go. A Ch4 workspace object (resolved via
   * `resolveWorkspaceHref`), or a plain route for client-safe destinations
   * that shouldn't expose an internal object (e.g. a task). */
  ctaType?: WorkspaceObjectType
  ctaId?: string
  ctaHref?: string
}

export interface ReturnActivityItem {
  id: ID
  actorName: string
  actorAvatarUrl?: string
  action: string
  timestamp: string
}

export interface ReturnStatusDetail {
  returnId: ID
  stage: ReturnStage
  condition?: ReturnCondition
  nextAction: ReturnNextAction
  blocker?: ReturnBlocker
  activity: ReturnActivityItem[]
  updatedAt: string
  /** Set on the one or two demo returns where a stage just completed, to
   * show the "recently completed" micro-animation. */
  justCompletedStage?: ReturnStage
}
