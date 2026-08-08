import { SmartField, type SmartFieldProps } from './smart-field'
import type { ApprovalDetail } from '@/types'

export interface NeedsApprovalFieldProps
  extends Omit<SmartFieldProps, 'state' | 'onSave' | 'ai' | 'verification' | 'locked'> {
  approval: ApprovalDetail
}

/** "This requires human approval before it's final." Shows why, and — for
 * roles that can act — a direct Review action. */
export function NeedsApprovalField(props: NeedsApprovalFieldProps) {
  return <SmartField {...props} state="needs_approval" />
}
