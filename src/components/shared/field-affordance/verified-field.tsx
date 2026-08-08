import { SmartField, type SmartFieldProps } from './smart-field'
import type { VerificationDetail } from '@/types'

export interface VerifiedFieldProps
  extends Omit<SmartFieldProps, 'state' | 'onSave' | 'ai' | 'approval' | 'locked'> {
  verification: VerificationDetail
}

/** "This value has been reviewed." Click to see who, when, and from what
 * source — never editable unless explicitly reopened elsewhere. */
export function VerifiedField(props: VerifiedFieldProps) {
  return <SmartField {...props} state="verified" />
}
