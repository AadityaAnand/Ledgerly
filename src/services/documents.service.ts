import { documents } from '@/mock'
import { mockDelay } from '@/lib/mock-delay'
import type { Document } from '@/types'

export async function fetchDocuments(): Promise<Document[]> {
  return mockDelay(documents)
}

export async function fetchDocumentsByClientId(clientId: string): Promise<Document[]> {
  return mockDelay(documents.filter((doc) => doc.clientId === clientId))
}

export async function fetchDocumentsByReturnId(returnId: string): Promise<Document[]> {
  return mockDelay(documents.filter((doc) => doc.returnId === returnId))
}
