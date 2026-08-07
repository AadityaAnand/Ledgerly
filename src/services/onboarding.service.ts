import { getOnboardingProfileByClientId } from '@/mock'
import { mockDelay } from '@/lib/mock-delay'
import type { ClientOnboardingProfile } from '@/types'

export async function fetchOnboardingProfile(clientId: string): Promise<ClientOnboardingProfile | undefined> {
  return mockDelay(getOnboardingProfileByClientId(clientId), 400)
}
