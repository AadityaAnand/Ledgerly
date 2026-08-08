import { SmartField, type SmartFieldProps } from './smart-field'

export type ReadOnlyFieldProps = Omit<
  SmartFieldProps,
  'state' | 'onOpen' | 'onSave' | 'ai' | 'verification' | 'approval' | 'locked' | 'requiredPermission'
>

/** Plain, static display — no hover, no cursor change, nothing to click. */
export function ReadOnlyField(props: ReadOnlyFieldProps) {
  return <SmartField {...props} state="read_only" />
}
