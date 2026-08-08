import type { Permission } from './permissions'

/**
 * The seven interaction states every data-bearing field in Ledgerly can be
 * in. Centralized here so nothing downstream invents an eighth state or a
 * one-off visual treatment — see `lib/field-affordance.ts` for the visual
 * config that maps each state to copy, icon, and tone.
 */
export type FieldState =
  | 'read_only'
  | 'clickable'
  | 'editable'
  | 'ai_generated'
  | 'verified'
  | 'needs_approval'
  | 'locked'

export interface AIFieldDetail {
  confidence: number
  sourceLabel?: string
  reasoning?: string
}

export interface VerificationHistoryEntry {
  actorName: string
  action: string
  timestamp: string
}

export interface VerificationDetail {
  reviewerName: string
  reviewerAvatarUrl?: string
  timestamp: string
  sourceLabel?: string
  history?: VerificationHistoryEntry[]
}

export interface ApprovalDetail {
  reason: string
  confidence?: number
}

export interface LockedDetail {
  reason: string
  unlockHint?: string
}

/** Shared by every field wrapper — lets a field auto-downgrade to `locked`
 * when the active role lacks the permission, instead of every call site
 * hand-rolling its own `hasPermission` check. */
export interface FieldPermissionGate {
  requiredPermission?: Permission
  deniedReason?: string
}
