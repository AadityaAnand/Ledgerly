import { clients } from '@/mock'
import { mockDelay } from '@/lib/mock-delay'
import type { Client } from '@/types'

export async function fetchClients(): Promise<Client[]> {
  return mockDelay(clients)
}

export async function fetchClientById(id: string): Promise<Client | undefined> {
  return mockDelay(clients.find((client) => client.id === id))
}
