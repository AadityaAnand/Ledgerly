import { SmartField, type SmartFieldProps } from './smart-field'
import type { AIFieldDetail } from '@/types'

export interface AIGeneratedFieldProps
  extends Omit<SmartFieldProps, 'state' | 'onSave' | 'verification' | 'approval' | 'locked'> {
  ai: AIFieldDetail
}

/** "This value came from AI." Click to see confidence, source, and
 * reasoning — plus Edit / Mark Verified where the role allows it. */
export function AIGeneratedField(props: AIGeneratedFieldProps) {
  return <SmartField {...props} state="ai_generated" />
}
