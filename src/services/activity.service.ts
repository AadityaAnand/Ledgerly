import { activityFeed, timelineEvents } from '@/mock'
import { mockDelay } from '@/lib/mock-delay'
import type { ActivityFeedItem, TimelineEvent } from '@/types'

export async function fetchActivityFeed(): Promise<ActivityFeedItem[]> {
  return mockDelay(activityFeed)
}

export async function fetchTimelineByReturnId(returnId: string): Promise<TimelineEvent[]> {
  return mockDelay(timelineEvents.filter((event) => event.returnId === returnId))
}
