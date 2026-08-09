import type { Client, ReturnStatus, TaskPriority, TaskStatus, TaxReturn, Task } from '@/types'

/**
 * A larger, varied dataset so the work queue and prioritization logic have
 * enough volume to be genuinely demonstrable — 50+ returns and 30+ tasks
 * across many clients, stages, owners, and due dates. Generated with a
 * seeded PRNG so the data is realistic-looking but stable across reloads,
 * rather than hand-authoring dozens of near-identical records.
 */
function mulberry32(seed: number) {
  let s = seed
  return function random() {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(20260807)
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)]!
}
function pickWeighted<T>(entries: readonly (readonly [T, number])[]): T {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0)
  let roll = rand() * total
  for (const [value, weight] of entries) {
    roll -= weight
    if (roll <= 0) return value
  }
  return entries[entries.length - 1]![0]
}
function randInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min
}
function isoDaysFromToday(days: number, hour = 10): string {
  const d = new Date('2026-08-07T00:00:00.000Z')
  d.setUTCDate(d.getUTCDate() + days)
  d.setUTCHours(hour, randInt(0, 55), 0, 0)
  return d.toISOString()
}

const firstNames = [
  'Olivia', 'Ethan', 'Maria', 'Noah', 'Priya', 'Liam', 'Sofia', 'Mateo', 'Chloe', 'Daniel',
  'Ava', 'Lucas', 'Isabella', 'Henry', 'Amara', 'Owen', 'Layla', 'Gabriel', 'Nora', 'Caleb',
  'Freya', 'Julian', 'Elena', 'Theo', 'Ruby',
] as const
const lastNames = [
  'Torres', 'Bennett', 'Nakamura', 'Silva', 'Whitmore', 'Cohen', 'Delgado', 'Fischer', 'Adeyemi', 'Park',
  'Rossi', 'Novak', 'Hartley', 'Ibarra', 'Sato', 'Larsen', 'Okonkwo', 'Reyes', 'Bianchi', 'Kowalski',
] as const
const businessWords = [
  'Summit', 'Northgate', 'Bluepeak', 'Harborlight', 'Cascade', 'Ironwood', 'Meridian', 'Fieldstone',
  'Redwood', 'Anchor', 'Silverline', 'Copperleaf', 'Brightwater', 'Vantage', 'Windward',
] as const
const businessKinds = [
  ['Consulting', 'LLC'], ['Design Studio', ''], ['Logistics', 'Inc.'], ['Landscaping', 'LLC'],
  ['Dental Group', ''], ['Realty', 'Group'], ['Contracting', 'LLC'], ['Media', 'Co.'],
  ['Wellness', 'Studio'], ['Bakery', ''], ['Software', 'Inc.'], ['Law Group', ''],
] as const

const staffIds = ['usr_1', 'usr_2', 'usr_3', 'usr_4', 'usr_5', 'usr_6', 'usr_14'] as const
// Sarah (usr_1) gets a lighter share — she's Managing Partner first, preparer
// second — everyone else is weighted evenly.
const preparerIds = ['usr_1', 'usr_2', 'usr_2', 'usr_4', 'usr_4', 'usr_5', 'usr_5', 'usr_14', 'usr_14'] as const
const reviewerIds = ['usr_3', 'usr_6'] as const

const formTypesByType: Record<'individual' | 'business', string[]> = {
  individual: ['1040'],
  business: ['1120-S', '1065', '1120'],
}

const statusWeights: [ReturnStatus, number][] = [
  ['not_started', 6],
  ['gathering_documents', 12],
  ['needs_client_info', 10],
  ['in_preparation', 14],
  ['in_review', 10],
  ['ready_to_file', 6],
  ['filed', 8],
  ['accepted', 6],
]

const dueDateOffsets = [-4, -2, -1, 0, 0, 1, 1, 2, 3, 5, 7, 10, 14, 21, 30, 45, 60] as const

const CLIENT_COUNT = 34

export const generatedClients: Client[] = Array.from({ length: CLIENT_COUNT }, (_, i) => {
  const id = `cli_g${i + 1}`
  const isBusiness = rand() < 0.45
  const preparerId = pick(preparerIds)
  const createdOffset = randInt(-500, -20)

  if (isBusiness) {
    const [kind, suffix] = pick(businessKinds)
    const name = `${pick(businessWords)} ${kind}${suffix ? ` ${suffix}` : ''}`
    return {
      id,
      name,
      type: 'business',
      email: `accounts@${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`,
      entityType: suffix === 'Inc.' ? 'C-Corp' : suffix === 'Group' || suffix === 'Co.' ? 'Partnership' : 'LLC',
      status: 'active',
      taxYear: 2025,
      primaryPreparerId: preparerId,
      returnIds: [],
      initials: name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase(),
      createdAt: isoDaysFromToday(createdOffset),
    } satisfies Client
  }

  const first = pick(firstNames)
  const last = pick(lastNames)
  const name = `${first} ${last}`
  return {
    id,
    name,
    type: 'individual',
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    entityType: 'Individual (1040)',
    status: 'active',
    taxYear: 2025,
    primaryPreparerId: preparerId,
    returnIds: [],
    initials: `${first[0]}${last[0]}`.toUpperCase(),
    createdAt: isoDaysFromToday(createdOffset),
  } satisfies Client
})

let returnSeq = 0
export const generatedReturns: TaxReturn[] = generatedClients.flatMap((client) => {
  const returnCount = rand() < 0.25 ? 2 : 1
  return Array.from({ length: returnCount }, (_, i) => {
    returnSeq += 1
    const id = `ret_g${returnSeq}`
    client.returnIds.push(id)
    const status = pickWeighted(statusWeights)
    const isTerminal = status === 'filed' || status === 'accepted'
    const formType = i === 0 ? pick(formTypesByType[client.type]) : '1040'
    const preparerId = client.primaryPreparerId
    const reviewer = rand() < 0.55 ? pick(reviewerIds) : undefined
    const progress = isTerminal
      ? 100
      : status === 'not_started'
        ? 0
        : status === 'ready_to_file'
          ? randInt(90, 98)
          : randInt(15, 85)
    const dueOffset = isTerminal ? randInt(-90, -10) : pick(dueDateOffsets)
    const aiFlagCount = !isTerminal && rand() < 0.3 ? randInt(1, 3) : 0
    const updatedOffset = isTerminal ? randInt(-60, -5) : randInt(-6, 0)

    return {
      id,
      clientId: client.id,
      taxYear: 2025,
      formType,
      status,
      assignedPreparerId: preparerId,
      assignedReviewerId: reviewer,
      dueDate: isoDaysFromToday(dueOffset).slice(0, 10),
      progress,
      ...(client.type === 'business' && rand() < 0.5
        ? { estimatedOwed: randInt(1200, 24000) }
        : { estimatedRefund: randInt(400, 6200) }),
      aiFlagCount,
      createdAt: isoDaysFromToday(randInt(-200, -30)),
      updatedAt: isoDaysFromToday(updatedOffset),
    } satisfies TaxReturn
  })
})

const taskTitlesByKind = {
  document: [
    'Request missing 1099 from',
    'Follow up on outstanding bank statements for',
    'Collect signed engagement letter from',
    'Request prior-year return copy from',
    'Chase down missing W-2 for',
  ],
  review: [
    'Review AI-extracted values for',
    'Confirm depreciation schedule for',
    'Reconcile reported income for',
    'Verify deduction eligibility for',
    'Double-check K-1 allocation for',
  ],
  prep: [
    'Prepare Schedule C for',
    'Finish return preparation for',
    'Draft final numbers for',
    'Enter remaining W-2 data for',
  ],
  admin: [
    'Schedule year-end call with',
    'Send engagement letter renewal to',
    'Update file notes for',
    'Confirm filing address for',
  ],
} as const

const taskStatusWeights: [TaskStatus, number][] = [
  ['todo', 40],
  ['in_progress', 30],
  ['blocked', 10],
  ['done', 20],
]
const taskPriorityWeights: [TaskPriority, number][] = [
  ['urgent', 10],
  ['high', 25],
  ['medium', 40],
  ['low', 25],
]

const TASK_COUNT = 30

export const generatedTasks: Task[] = Array.from({ length: TASK_COUNT }, (_, i) => {
  const id = `task_g${i + 1}`
  const client = pick(generatedClients)
  const clientReturns = generatedReturns.filter((r) => r.clientId === client.id)
  const linkedReturn = clientReturns.length > 0 && rand() < 0.8 ? pick(clientReturns) : undefined
  const kind = pick(['document', 'review', 'prep', 'admin'] as const)
  const titlePrefix = pick(taskTitlesByKind[kind])
  const status = pickWeighted(taskStatusWeights)
  const priority = pickWeighted(taskPriorityWeights)
  const assignee = linkedReturn?.assignedPreparerId ?? pick(staffIds)
  const dueOffset = status === 'done' ? randInt(-30, -1) : pick(dueDateOffsets)
  const createdOffset = randInt(-45, -1)

  return {
    id,
    title: `${titlePrefix} ${client.name}`,
    status,
    priority,
    assigneeId: assignee,
    clientId: client.id,
    returnId: linkedReturn?.id,
    dueDate: status === 'done' ? undefined : isoDaysFromToday(dueOffset).slice(0, 10),
    createdAt: isoDaysFromToday(createdOffset),
  } satisfies Task
})
