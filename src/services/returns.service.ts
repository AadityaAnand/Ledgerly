import { taxReturns } from '@/mock'
import { mockDelay } from '@/lib/mock-delay'
import type { TaxReturn } from '@/types'

export async function fetchReturns(): Promise<TaxReturn[]> {
  return mockDelay(taxReturns)
}

export async function fetchReturnById(id: string): Promise<TaxReturn | undefined> {
  return mockDelay(taxReturns.find((r) => r.id === id))
}

export async function fetchReturnsByClientId(clientId: string): Promise<TaxReturn[]> {
  return mockDelay(taxReturns.filter((r) => r.clientId === clientId))
}
