import { tasks } from '@/mock'
import { mockDelay } from '@/lib/mock-delay'
import type { Task } from '@/types'

export async function fetchTasks(): Promise<Task[]> {
  return mockDelay(tasks)
}

export async function fetchTasksByAssigneeId(assigneeId: string): Promise<Task[]> {
  return mockDelay(tasks.filter((task) => task.assigneeId === assigneeId))
}
