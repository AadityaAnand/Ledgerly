import type { ID } from './common'

export type AISuggestionSeverity = 'info' | 'warning' | 'critical'

export interface AISuggestion {
  id: ID
  returnId: ID
  title: string
  description: string
  severity: AISuggestionSeverity
  category: 'deduction' | 'discrepancy' | 'compliance' | 'optimization'
  resolved: boolean
  createdAt: string
}
