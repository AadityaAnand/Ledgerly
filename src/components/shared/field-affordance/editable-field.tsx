import { SmartField, type SmartFieldProps } from './smart-field'

export interface EditableFieldProps
  extends Omit<SmartFieldProps, 'state' | 'ai' | 'verification' | 'approval' | 'locked'> {
  onSave: (value: string) => void | Promise<void>
}

/** "This value can be changed." Click or focus to edit inline — no modal. */
export function EditableField(props: EditableFieldProps) {
  return <SmartField {...props} state="editable" />
}
