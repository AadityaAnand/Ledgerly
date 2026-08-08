import { SmartField, type SmartFieldProps } from './smart-field'

export interface ClickableFieldProps
  extends Omit<SmartFieldProps, 'state' | 'onSave' | 'ai' | 'verification' | 'approval' | 'locked'> {
  onOpen: () => void
}

/** "This opens something." A document, a client, a return, a task, a
 * message — anything that navigates elsewhere. */
export function ClickableField(props: ClickableFieldProps) {
  return <SmartField {...props} state="clickable" />
}
