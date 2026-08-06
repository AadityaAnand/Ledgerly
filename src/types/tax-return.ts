import type { ID } from './common'

export type ReturnStatus =
  | 'not_started'
  | 'gathering_documents'
  | 'in_preparation'
  | 'in_review'
  | 'needs_client_info'
  | 'ready_to_file'
  | 'filed'
  | 'accepted'
  | 'rejected'

export interface TaxReturn {
  id: ID
  clientId: ID
  taxYear: number
  formType: string
  status: ReturnStatus
  assignedPreparerId: ID
  assignedReviewerId?: ID
  dueDate: string
  progress: number
  estimatedRefund?: number
  estimatedOwed?: number
  aiFlagCount: number
  createdAt: string
  updatedAt: string
}
