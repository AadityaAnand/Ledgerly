import type { ID } from './common'

export type DocumentCategory = 'w2' | '1099' | 'k1' | 'receipt' | 'prior_return' | 'bank_statement' | 'other'

export type DocumentStatus = 'uploaded' | 'processing' | 'verified' | 'flagged'

export interface Document {
  id: ID
  clientId: ID
  returnId?: ID
  name: string
  category: DocumentCategory
  status: DocumentStatus
  uploadedById: ID
  fileSize: number
  fileType: 'pdf' | 'png' | 'jpg' | 'csv'
  pageCount?: number
  uploadedAt: string
  aiExtracted: boolean
}
