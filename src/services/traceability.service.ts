import { getTracesByReturnId, sourceDocuments, documentFieldSlots } from '@/mock'
import { mockDelay } from '@/lib/mock-delay'
import type { DocumentFieldSlot, SourceDocument, TaxFieldTrace } from '@/types'

export async function fetchFieldTraces(returnId: string): Promise<TaxFieldTrace[]> {
  return mockDelay(getTracesByReturnId(returnId), 500)
}

export async function fetchSourceDocuments(): Promise<SourceDocument[]> {
  return mockDelay(sourceDocuments, 500)
}

export async function fetchDocumentFieldSlots(): Promise<DocumentFieldSlot[]> {
  return mockDelay(documentFieldSlots, 500)
}
