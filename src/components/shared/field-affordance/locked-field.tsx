import { SmartField, type SmartFieldProps } from './smart-field'
import type { LockedDetail } from '@/types'

export interface LockedFieldProps
  extends Omit<SmartFieldProps, 'state' | 'onSave' | 'ai' | 'verification' | 'approval'> {
  locked: LockedDetail
}

/** "This cannot be changed" — plus why, always. Never a bare disabled
 * input; the reason is part of the component, not an afterthought. */
export function LockedField(props: LockedFieldProps) {
  return <SmartField {...props} state="locked" />
}
