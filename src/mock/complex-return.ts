import type { Document, DocumentCategory, DocumentStatus, Task, TaskPriority, TaskStatus, TaxFieldTrace, TraceCategory, VerificationStatus } from '@/types'

/**
 * Challenge 9's "complexity made navigable" dataset. Rather than inventing a
 * new client, this deliberately piles hundreds of additional generated
 * fields, documents, and tasks onto `ret_1` — Ledgerly's most fully-built
 * return — so the existing Return Review workspace has to prove it can
 * stay navigable at real professional scale, not just look good with a
 * handful of curated rows. Seeded PRNG mirrors `generated-work.ts`: stable
 * across reloads, no hand-authored volume.
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

const rand = mulberry32(20260809)
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
function isoDaysFromToday(days: number, hour = 9): string {
  const d = new Date('2026-08-07T00:00:00.000Z')
  d.setUTCDate(d.getUTCDate() + days)
  d.setUTCHours(hour, randInt(0, 55), 0, 0)
  return d.toISOString()
}

const RETURN_ID = 'ret_1'
const CLIENT_ID = 'cli_1'
const PREPARER_ID = 'usr_2'
const REVIEWER_ID = 'usr_3'
const UPLOADER_IDS = ['usr_2', 'usr_7', 'usr_1'] as const

// ─────────────────────────────── Field traces ───────────────────────────────

interface FieldTemplate {
  category: TraceCategory
  label: string
  formLine: string
  min: number
  max: number
}

const FIELD_TEMPLATES: Record<TraceCategory, FieldTemplate[]> = {
  income: [
    { category: 'income', label: 'Client Engagement Revenue', formLine: 'Schedule C, Line 1', min: 800, max: 42_000 },
    { category: 'income', label: 'Retainer Income', formLine: 'Schedule C, Line 1', min: 500, max: 18_000 },
    { category: 'income', label: 'Interest Income', formLine: 'Form 1040, Line 2b', min: 40, max: 3_200 },
    { category: 'income', label: 'Dividend Income', formLine: 'Form 1040, Line 3b', min: 60, max: 9_400 },
    { category: 'income', label: 'Capital Gain Distribution', formLine: 'Schedule D, Line 13', min: 100, max: 22_000 },
    { category: 'income', label: 'Rental Income', formLine: 'Schedule E, Line 3', min: 900, max: 14_500 },
  ],
  business: [
    { category: 'business', label: 'Software & Subscriptions', formLine: 'Schedule C, Line 27a', min: 60, max: 4_200 },
    { category: 'business', label: 'Contractor Payment', formLine: 'Schedule C, Line 11', min: 500, max: 12_000 },
    { category: 'business', label: 'Office Supplies', formLine: 'Schedule C, Line 22', min: 40, max: 1_800 },
    { category: 'business', label: 'Travel Expense', formLine: 'Schedule C, Line 24a', min: 120, max: 6_500 },
    { category: 'business', label: 'Equipment Depreciation', formLine: 'Form 4562, Line 17', min: 300, max: 9_000 },
    { category: 'business', label: 'Business Insurance Premium', formLine: 'Schedule C, Line 15', min: 200, max: 5_400 },
    { category: 'business', label: 'K-1 Ordinary Business Income', formLine: 'Schedule K-1, Box 1', min: 1_000, max: 38_000 },
  ],
  deductions: [
    { category: 'deductions', label: 'Mortgage Interest', formLine: 'Schedule A, Line 8a', min: 4_000, max: 24_000 },
    { category: 'deductions', label: 'Charitable Contribution', formLine: 'Schedule A, Line 11', min: 100, max: 9_500 },
    { category: 'deductions', label: 'Medical Expense', formLine: 'Schedule A, Line 1', min: 300, max: 11_000 },
    { category: 'deductions', label: 'State & Local Tax', formLine: 'Schedule A, Line 5a', min: 800, max: 10_000 },
    { category: 'deductions', label: 'Home Office Deduction', formLine: 'Form 8829, Line 36', min: 400, max: 7_200 },
    { category: 'deductions', label: 'Vehicle Expense', formLine: 'Schedule C, Line 9', min: 300, max: 6_800 },
  ],
  credits: [
    { category: 'credits', label: 'Child Tax Credit', formLine: 'Form 1040, Line 19', min: 500, max: 4_000 },
    { category: 'credits', label: 'Retirement Savings Credit', formLine: 'Form 8880, Line 12', min: 100, max: 2_000 },
    { category: 'credits', label: 'Energy Efficiency Credit', formLine: 'Form 5695, Line 30', min: 200, max: 3_200 },
    { category: 'credits', label: 'Foreign Tax Credit', formLine: 'Form 1116, Line 33', min: 50, max: 1_800 },
    { category: 'credits', label: 'Education Credit', formLine: 'Form 8863, Line 19', min: 300, max: 2_500 },
  ],
  payments_credits: [
    { category: 'payments_credits', label: 'Federal Withholding', formLine: 'Form 1040, Line 25a', min: 2_000, max: 32_000 },
    { category: 'payments_credits', label: 'Estimated Tax Payment', formLine: 'Form 1040, Line 26', min: 500, max: 18_000 },
    { category: 'payments_credits', label: 'State Withholding', formLine: 'Schedule 5, Line 6', min: 800, max: 9_000 },
    { category: 'payments_credits', label: 'Prior-Year Overpayment Applied', formLine: 'Form 1040, Line 26', min: 100, max: 4_500 },
  ],
  tax_summary: [
    { category: 'tax_summary', label: 'Alternative Minimum Tax', formLine: 'Form 6251, Line 11', min: 0, max: 6_000 },
    { category: 'tax_summary', label: 'Self-Employment Tax', formLine: 'Schedule SE, Line 12', min: 500, max: 9_000 },
    { category: 'tax_summary', label: 'Net Investment Income Tax', formLine: 'Form 8960, Line 17', min: 0, max: 4_200 },
  ],
}

const verificationWeights: [VerificationStatus, number][] = [
  ['verified', 52],
  ['needs_review', 16],
  ['unverified', 14],
  ['flagged', 9],
  ['overridden', 5],
  ['rejected', 4],
]

const CATEGORY_COUNTS: Record<TraceCategory, number> = {
  income: 34,
  business: 40,
  deductions: 32,
  credits: 22,
  payments_credits: 20,
  tax_summary: 12,
}

let traceSeq = 0
export const generatedTraces: TaxFieldTrace[] = (Object.keys(CATEGORY_COUNTS) as TraceCategory[]).flatMap((category) => {
  const templates = FIELD_TEMPLATES[category]
  const count = CATEGORY_COUNTS[category]
  return Array.from({ length: count }, (_, i) => {
    traceSeq += 1
    const id = `gtf_${traceSeq}`
    const template = pick(templates)
    const value = randInt(template.min, template.max)
    const verification = pickWeighted(verificationWeights)
    const isCalculated = rand() < 0.18
    const confidence = isCalculated
      ? randInt(80, 99)
      : verification === 'flagged' || verification === 'rejected'
        ? randInt(35, 68)
        : verification === 'needs_review'
          ? randInt(55, 82)
          : randInt(72, 99)
    const hasConflict = !isCalculated && rand() < 0.07
    const reviewedIso = isoDaysFromToday(randInt(-40, -1))
    const isReviewed = verification === 'verified' || verification === 'overridden'

    const label = `${template.label} #${i + 1}`
    const timestamp = isoDaysFromToday(randInt(-60, -2))

    return {
      id,
      returnId: RETURN_ID,
      category,
      label,
      formLine: template.formLine,
      value,
      verification,
      confidence,
      isCalculated,
      aiExplanation: isCalculated
        ? `Computed from related upstream fields on this return using the ${template.formLine} formula.`
        : `Extracted from a source document and mapped to ${template.formLine}.`,
      transformationSteps: isCalculated
        ? ['Gathered upstream field values', `Applied the ${template.formLine} calculation`]
        : ['Read the value from the source document', `Mapped to ${template.formLine}`],
      validationRules: [
        { label: 'Within expected range for this field type', passed: verification !== 'flagged' && verification !== 'rejected' },
      ],
      reviewerId: isReviewed ? REVIEWER_ID : undefined,
      reviewedAt: isReviewed ? reviewedIso : undefined,
      reviewHistory: isReviewed
        ? [
            {
              id: `${id}_rh1`,
              actorId: REVIEWER_ID,
              action: verification === 'overridden' ? ('edited' as const) : ('approved' as const),
              timestamp: reviewedIso,
            },
          ]
        : [],
      timeline: [
        {
          id: `${id}_evt1`,
          type: isCalculated ? ('calculated' as const) : ('extracted' as const),
          label: isCalculated ? 'Value calculated' : 'Value extracted',
          description: isCalculated ? `Applied the ${template.formLine} formula.` : 'Read from the source document.',
          timestamp,
        },
        ...(isReviewed
          ? [
              {
                id: `${id}_evt2`,
                type: 'approved' as const,
                label: 'Reviewed and approved',
                description: `${REVIEWER_ID === 'usr_3' ? 'Priya Nathan' : 'Reviewer'} signed off on this value.`,
                timestamp: reviewedIso,
              },
            ]
          : []),
      ],
      hasConflict,
      conflictNote: hasConflict ? 'This value differs from a related figure elsewhere on the return.' : undefined,
      ...(verification === 'flagged' || verification === 'needs_review'
        ? { suggestedAction: 'Confirm this figure against the source document before approving.' }
        : {}),
    } satisfies TaxFieldTrace
  })
})

// ─────────────────────────────── Documents ───────────────────────────────

const docCategoryTemplates: [DocumentCategory, string[]][] = [
  ['w2', ['W-2 — Contractor', 'W-2 — Staff']],
  ['1099', ['1099-NEC — Client Engagement', '1099-INT — Bank Interest', '1099-DIV — Brokerage', '1099-MISC — Vendor']],
  ['k1', ['K-1 — Partnership Interest', 'K-1 — Holdings LP']],
  ['receipt', ['Receipt — Office Supplies', 'Receipt — Travel', 'Receipt — Equipment', 'Receipt — Software Subscription']],
  ['bank_statement', ['Bank Statement — Operating Account', 'Bank Statement — Savings']],
  ['prior_return', ['Prior-Year Return Copy']],
  ['other', ['Engagement Letter', 'Depreciation Schedule', 'Mileage Log', 'Expense Report', 'Vendor Invoice']],
]

const fileTypeByCategory: Record<DocumentCategory, Document['fileType'][]> = {
  w2: ['pdf'],
  '1099': ['pdf'],
  k1: ['pdf'],
  receipt: ['pdf', 'jpg', 'png'],
  bank_statement: ['pdf', 'csv'],
  prior_return: ['pdf'],
  other: ['pdf', 'csv'],
}

const documentStatusWeights: [DocumentStatus, number][] = [
  ['verified', 48],
  ['uploaded', 22],
  ['processing', 16],
  ['flagged', 14],
]

const DOCUMENT_COUNT = 214

let docSeq = 0
export const generatedDocuments: Document[] = Array.from({ length: DOCUMENT_COUNT }, () => {
  docSeq += 1
  const id = `gdoc_${docSeq}`
  const [category, names] = pick(docCategoryTemplates)
  const namePrefix = pick(names)
  const status = pickWeighted(documentStatusWeights)
  const fileType = pick(fileTypeByCategory[category])
  const aiExtracted = fileType !== 'jpg' && fileType !== 'png' && rand() < 0.82

  return {
    id,
    clientId: CLIENT_ID,
    returnId: RETURN_ID,
    name: `${namePrefix} ${docSeq}.${fileType}`,
    category,
    status,
    uploadedById: pick(UPLOADER_IDS),
    fileSize: randInt(24, 620) * 1000,
    fileType,
    pageCount: fileType === 'csv' ? undefined : randInt(1, 12),
    uploadedAt: isoDaysFromToday(randInt(-140, -1), randInt(7, 19)),
    aiExtracted,
  } satisfies Document
})

// ─────────────────────────────── Tasks ───────────────────────────────

const taskTitleTemplates = [
  'Confirm Schedule C expense categorization',
  'Reconcile K-1 basis worksheet',
  'Verify Box 1 wages against W-2',
  'Follow up on missing receipt',
  'Resolve duplicate 1099 entry',
  'Confirm home office square footage',
  'Cross-check depreciation schedule',
  'Clarify charitable contribution documentation',
  'Confirm estimated payment amounts with client',
  'Review AI-flagged mismatch',
  'Chase down bank statement for Q3',
  'Verify mileage log totals',
  'Confirm dependent eligibility for credit',
  'Reconcile prior-year carryover',
  'Double-check state withholding figure',
] as const

const taskStatusWeights: [TaskStatus, number][] = [
  ['todo', 34],
  ['in_progress', 26],
  ['blocked', 12],
  ['done', 28],
]
const taskPriorityWeights: [TaskPriority, number][] = [
  ['urgent', 8],
  ['high', 24],
  ['medium', 42],
  ['low', 26],
]

const TASK_COUNT = 68

let taskSeq = 0
export const generatedIssueTasks: Task[] = Array.from({ length: TASK_COUNT }, () => {
  taskSeq += 1
  const id = `gtask_${taskSeq}`
  const status = pickWeighted(taskStatusWeights)
  const priority = pickWeighted(taskPriorityWeights)

  return {
    id,
    title: `${pick(taskTitleTemplates)} #${taskSeq}`,
    status,
    priority,
    assigneeId: rand() < 0.6 ? PREPARER_ID : REVIEWER_ID,
    clientId: CLIENT_ID,
    returnId: RETURN_ID,
    dueDate: status === 'done' ? undefined : isoDaysFromToday(pick([-2, -1, 0, 1, 2, 3, 5, 7, 10, 14, 21])).slice(0, 10),
    createdAt: isoDaysFromToday(randInt(-90, -1)),
  } satisfies Task
})
