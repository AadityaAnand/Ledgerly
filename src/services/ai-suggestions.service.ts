import { aiSuggestions } from '@/mock'
import { mockDelay } from '@/lib/mock-delay'
import type { AISuggestion } from '@/types'

export async function fetchAISuggestionsByReturnId(returnId: string): Promise<AISuggestion[]> {
  return mockDelay(aiSuggestions.filter((s) => s.returnId === returnId))
}
