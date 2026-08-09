import { getTraceById } from './field-traces'
import { aiSuggestions } from './ai-suggestions'
import { getReturnById } from './returns'
import { documents } from './documents'
import { getSourceDocumentById } from './source-documents'
import { getReturnAIFindings } from '@/features/return-workspace/lib/return-workspace-data'
import type { AIFinding, AIFindingCategory } from '@/types'

const CLIENT_ID = 'cli_1'
const RETURN_ID = 'ret_1'
const PREPARER_ID = 'usr_2' // Marcus Webb

/**
 * The AI finding catalog for the whole app. Three layers, all normalized
 * into the same `AIFinding` shape so the review workspace never has to
 * special-case where a finding came from:
 *
 * 1. Eight hand-authored flagship findings below — one per category, most
 *    of them wrapping *real* `TaxFieldTrace` records (`k1_passthrough_income`,
 *    `rental_income`, `tax_due`, `student_loan_interest`, `medical_expenses`,
 *    `business_income`) rather than inventing parallel data.
 * 2. Every `AISuggestion` from `mock/ai-suggestions.ts` — unchanged at the
 *    source, just reshaped for this richer view.
 * 3. The bulk AI findings already derived from the large generated
 *    field-trace dataset — reused as-is for queue volume.
 */

const flagshipFindings: AIFinding[] = (() => {
  const businessIncome = getTraceById('business_income')!
  const k1 = getTraceById('k1_passthrough_income')!
  const rental = getTraceById('rental_income')!
  const taxDue = getTraceById('tax_due')!
  const studentLoan = getTraceById('student_loan_interest')!
  const medical = getTraceById('medical_expenses')!
  const k1Doc = getSourceDocumentById('doc-k1')
  const bankDoc = getSourceDocumentById('doc-bankstatement')

  const findings: AIFinding[] = [
    // ── High-confidence extraction ──────────────────────────────────
    {
      id: 'aif_high_confidence_business_income',
      title: 'Business Income extracted cleanly',
      category: 'extraction',
      severity: 'info',
      status: 'high_confidence',
      confidence: businessIncome.confidence,
      confidenceReasons: [
        'Source document matched',
        'Tax year verified',
        'Field structure recognized',
        'Value passed validation',
      ],
      explanation:
        "Ledgerly's AI read the Total Revenue line from Bennett Design Studio's P&L statement and mapped it directly to Schedule C, Line 1 — a single clean source with no conflicting figures.",
      evidence: [
        { label: 'Source', value: '2025 P&L Statement', sourceDocumentId: 'doc_1' },
        { label: 'Total Revenue', value: '$142,850.00' },
        { label: 'Mapped to', value: 'Schedule C, Line 1' },
        { label: 'Validation', value: 'Matches P&L total revenue line — passed' },
      ],
      recommendation: { label: 'Mark verified', action: 'accept_suggestion' },
      returnId: RETURN_ID,
      clientId: CLIENT_ID,
      relatedFieldId: 'business_income',
      reviewerId: businessIncome.reviewerId,
      reviewedAt: businessIncome.reviewedAt,
      reviewHistory: businessIncome.reviewHistory,
      timeline: businessIncome.timeline,
      createdAt: '2026-07-18T09:06:00.000Z',
    },

    // ── Discrepancy / potential income mismatch ─────────────────────
    {
      id: 'aif_wages_mismatch',
      title: 'Potential income mismatch',
      category: 'discrepancy',
      severity: 'critical',
      status: 'needs_review',
      confidence: 87,
      confidenceReasons: [
        'Source document matched',
        'Tax year verified',
        'Field structure recognized',
      ],
      uncertaintyReasons: ['The return value hasn’t been updated since the W-2 was uploaded — may simply be stale.'],
      explanation:
        "The AI compared the wages reported on Laura Bennett's W-2 with the wages currently entered on the return and found a $2,000 difference.",
      evidence: [
        { label: 'W-2 Box 1 — Wages', value: '$46,800.00', sourceDocumentId: 'doc-w2', pageNumber: 1, boxLabel: 'Box 1', isDiscrepant: true },
        { label: 'Return — Wages', value: '$44,800.00', isDiscrepant: true },
        { label: 'Difference', value: '$2,000.00', isDiscrepant: true },
        { label: 'Validation', value: 'Value does not match source document — failed' },
      ],
      recommendation: { label: 'Review discrepancy', action: 'review_discrepancy' },
      returnId: RETURN_ID,
      clientId: CLIENT_ID,
      relatedDocumentId: 'doc-w2',
      currentValue: 44_800,
      suggestedValue: 46_800,
      reviewHistory: [],
      timeline: [
        {
          id: 'aif_wages_evt_1',
          type: 'extracted',
          label: 'Wages extracted from W-2',
          description: 'Read Box 1 wages from the uploaded W-2.',
          timestamp: '2026-07-20T09:05:00.000Z',
        },
        {
          id: 'aif_wages_evt_2',
          type: 'flagged',
          label: 'Mismatch detected',
          description: 'W-2 wages differ from the amount currently entered on the return by $2,000.',
          timestamp: '2026-07-20T09:06:00.000Z',
        },
      ],
      createdAt: '2026-07-20T09:06:00.000Z',
    },

    // ── Missing supporting document ─────────────────────────────────
    {
      id: 'aif_missing_1098e',
      title: 'Missing supporting document',
      category: 'missing_document',
      severity: 'warning',
      status: 'needs_review',
      confidence: studentLoan.confidence,
      confidenceReasons: [],
      uncertaintyReasons: [
        'No source document has been uploaded for this field',
        'Nothing to extract or validate yet',
      ],
      explanation: studentLoan.aiExplanation,
      evidence: [
        { label: 'Expected document', value: 'Form 1098-E (Student Loan Interest Statement)' },
        { label: 'Return', value: 'Schedule 1, Line 21 — not yet entered' },
        { label: 'Validation', value: 'Source document on file — failed' },
      ],
      recommendation: { label: 'Request document', action: 'request_document' },
      returnId: RETURN_ID,
      clientId: CLIENT_ID,
      relatedFieldId: 'student_loan_interest',
      reviewHistory: studentLoan.reviewHistory,
      timeline: studentLoan.timeline,
      createdAt: '2026-07-30T09:00:00.000Z',
    },

    // ── Unusual / low-confidence deduction ──────────────────────────
    {
      id: 'aif_medical_low_confidence',
      title: 'Medical expenses inferred, not itemized',
      category: 'unusual_deduction',
      severity: 'warning',
      status: 'needs_review',
      confidence: medical.confidence,
      confidenceReasons: [],
      uncertaintyReasons: [
        'Document quality is poor — no itemized receipts on file',
        'Amount was inferred from bank statement merchant names, not source receipts',
        'Manual normalization was required to match provider categories',
      ],
      explanation: medical.aiExplanation,
      evidence: [
        { label: 'Source', value: bankDoc?.name ?? 'Bank Statement — Chase Business Checking.pdf', sourceDocumentId: 'doc-bankstatement' },
        { label: 'Matched transactions', value: '4 healthcare-provider charges' },
        { label: 'Estimated total', value: '$6,180.00' },
        { label: 'Validation', value: 'Confirmed against itemized receipts — failed' },
      ],
      recommendation: { label: 'Request document', action: 'request_document' },
      returnId: RETURN_ID,
      clientId: CLIENT_ID,
      relatedFieldId: 'medical_expenses',
      reviewHistory: medical.reviewHistory,
      timeline: medical.timeline,
      createdAt: '2026-08-01T09:08:00.000Z',
    },

    // ── Conflicting source values ────────────────────────────────────
    {
      id: 'aif_k1_conflict',
      title: 'Conflicting source values',
      category: 'conflicting_values',
      severity: 'critical',
      status: 'needs_review',
      confidence: k1.confidence,
      confidenceReasons: ['Source document matched', 'Field structure recognized'],
      uncertaintyReasons: [
        'Source value conflicts with last year’s K-1 on file',
        'No amended partnership agreement is on file to support the change',
      ],
      explanation: k1.aiExplanation,
      evidence: [
        { label: k1Doc?.name ?? 'Schedule K-1 (Form 1065)', value: '32.00% allocation (2025)', sourceDocumentId: 'doc-k1', pageNumber: 1, boxLabel: 'Line 1', isDiscrepant: true },
        { label: 'Prior-year K-1 on file', value: '28.00% allocation (2024)', isDiscrepant: true },
        { label: 'Return', value: '$9,450.00 — Schedule E, Line 28' },
        { label: 'Validation', value: 'Allocation % consistent with prior year — failed' },
      ],
      recommendation: { label: 'Review discrepancy', action: 'review_discrepancy' },
      returnId: RETURN_ID,
      clientId: CLIENT_ID,
      relatedFieldId: 'k1_passthrough_income',
      relatedDocumentId: 'doc-k1',
      reviewHistory: k1.reviewHistory,
      timeline: k1.timeline,
      createdAt: '2026-07-29T16:07:00.000Z',
    },

    // ── Suggested correction (already resolved by a human) ──────────
    {
      id: 'aif_rental_corrected',
      title: 'Rental income total corrected',
      category: 'suggested_correction',
      severity: 'info',
      status: 'human_corrected',
      confidence: rental.confidence,
      confidenceReasons: ['Source document matched', 'Pattern-matched recurring deposits'],
      uncertaintyReasons: ['Two deposits were posted under an abbreviated payer name and weren’t auto-matched.'],
      explanation: rental.aiExplanation,
      evidence: [
        { label: 'Source', value: 'Bank Statement — Chase Business Checking.pdf', sourceDocumentId: 'doc-bankstatement' },
        { label: 'AI suggestion', value: '$16,200.00 (10 of 12 deposits matched)' },
        { label: 'Corrected value', value: '$18,000.00 (12 of 12 deposits)' },
        { label: 'Validation', value: 'Matches manually verified deposit count — passed' },
      ],
      recommendation: { label: 'View details', action: 'view_details' },
      returnId: RETURN_ID,
      clientId: CLIENT_ID,
      relatedFieldId: 'rental_income',
      relatedDocumentId: 'doc-bankstatement',
      currentValue: 18_000,
      suggestedValue: 16_200,
      correctedValue: 18_000,
      correctionReason: rental.reviewHistory[0]?.note,
      reviewerId: PREPARER_ID,
      reviewedAt: rental.reviewedAt,
      reviewHistory: rental.reviewHistory,
      timeline: rental.timeline,
      createdAt: '2026-08-03T14:10:00.000Z',
    },

    // ── Calculation issue ─────────────────────────────────────────────
    {
      id: 'aif_tax_due_calculation',
      title: 'Final balance still depends on pending fields',
      category: 'calculation_issue',
      severity: 'warning',
      status: 'needs_review',
      confidence: taxDue.confidence,
      confidenceReasons: ['Formula matches the Form 1040 tax computation worksheet', 'Calculation re-run automatically on every upstream change'],
      uncertaintyReasons: ['Three upstream fields (Capital Gains, Medical Expenses, K-1 Income) are still pending review.'],
      explanation: taxDue.aiExplanation,
      evidence: [
        { label: 'Formula', value: 'Total Tax − Total Payments = $8,340.00' },
        { label: 'Capital Gains', value: 'Needs review' },
        { label: 'Medical Expenses', value: 'Needs review' },
        { label: 'K-1 Income', value: 'Flagged — conflicting values' },
        { label: 'Validation', value: 'All upstream fields approved — failed' },
      ],
      recommendation: { label: 'Review discrepancy', action: 'review_discrepancy' },
      returnId: RETURN_ID,
      clientId: CLIENT_ID,
      relatedFieldId: 'tax_due',
      reviewHistory: taxDue.reviewHistory,
      timeline: taxDue.timeline,
      createdAt: '2026-08-04T15:05:00.000Z',
    },
  ]

  // ── Possible duplicate document — built from two real generated
  // documents that share a category and land within a day of each other,
  // rather than inventing a parallel pair. Deterministic: same seeded
  // dataset every load, so this always resolves to the same two files.
  const receiptPairCandidates = documents
    .filter((d) => d.returnId === RETURN_ID && d.category === 'receipt')
    .sort((a, b) => (a.uploadedAt < b.uploadedAt ? -1 : 1))
  const [dupA, dupB] = receiptPairCandidates
  if (dupA && dupB) {
    findings.push({
      id: 'aif_possible_duplicate',
      title: 'Possible duplicate document',
      category: 'duplicate_document',
      severity: 'info',
      status: 'needs_review',
      confidence: 74,
      confidenceReasons: ['Same document category', 'Uploaded within a short window of each other'],
      uncertaintyReasons: ['File contents weren’t compared byte-for-byte — only metadata similarity was checked.'],
      explanation: `“${dupA.name}” and “${dupB.name}” were both uploaded as receipts close together — this may be the same expense uploaded twice, or two genuinely separate purchases.`,
      evidence: [
        { label: 'Document A', value: dupA.name, sourceDocumentId: dupA.id },
        { label: 'Document B', value: dupB.name, sourceDocumentId: dupB.id },
        { label: 'Category', value: 'Receipt — both documents' },
      ],
      recommendation: { label: 'Mark as expected', action: 'mark_expected' },
      returnId: RETURN_ID,
      clientId: CLIENT_ID,
      relatedDocumentId: dupA.id,
      reviewHistory: [],
      timeline: [
        {
          id: 'aif_dup_evt_1',
          type: 'processing',
          label: 'Document similarity check',
          description: 'Compared newly uploaded receipts against existing documents on file.',
          timestamp: dupB.uploadedAt,
        },
        {
          id: 'aif_dup_evt_2',
          type: 'flagged',
          label: 'Possible duplicate flagged',
          description: 'Two receipts of the same type were uploaded close together.',
          timestamp: dupB.uploadedAt,
        },
      ],
      createdAt: dupB.uploadedAt,
    })
  }

  return findings
})()

/** Every `AISuggestion` on file, reshaped into an `AIFinding` — the source
 * data isn't touched, just presented consistently. */
const suggestionFindings: AIFinding[] = aiSuggestions.map((s) => {
  const taxReturn = getReturnById(s.returnId)
  const category: AIFindingCategory =
    s.category === 'discrepancy' ? 'discrepancy' : s.category === 'compliance' ? 'unusual_deduction' : 'suggested_correction'
  return {
    id: `aif_sugg_${s.id}`,
    title: s.title,
    category,
    severity: s.severity,
    status: s.resolved ? 'human_verified' : 'needs_review',
    confidence: s.severity === 'critical' ? 82 : s.severity === 'warning' ? 68 : 90,
    confidenceReasons: s.severity === 'info' ? ['Pattern recognized across similar returns', 'No conflicting source values found'] : [],
    uncertaintyReasons: s.severity !== 'info' ? ['Based on a pattern match rather than a direct document conflict.'] : undefined,
    explanation: s.description,
    evidence: [{ label: 'Return', value: taxReturn ? `${taxReturn.taxYear} ${taxReturn.formType}` : s.returnId }],
    recommendation: {
      label: s.resolved ? 'View details' : s.category === 'optimization' ? 'Ask CPA' : 'Review discrepancy',
      action: s.resolved ? 'view_details' : s.category === 'optimization' ? 'ask_cpa' : 'review_discrepancy',
    },
    returnId: s.returnId,
    clientId: taxReturn?.clientId ?? '',
    reviewHistory: [],
    timeline: [
      {
        id: `${s.id}_evt_flagged`,
        type: 'flagged',
        label: 'Flagged by AI',
        description: s.title,
        timestamp: s.createdAt,
      },
    ],
    createdAt: s.createdAt,
  } satisfies AIFinding
})

/** The bulk of the queue — every low-confidence / conflicting / suggested
 * finding already derived from the large generated field-trace dataset,
 * reused as-is for volume rather than re-derived here. */
const generatedFindings: AIFinding[] = getReturnAIFindings(RETURN_ID).map((f) => {
  const trace = getTraceById(f.id.replace(/^finding_(lowconf|conflict|suggest)_/, ''))
  const category: AIFindingCategory =
    f.type === 'low_confidence' ? 'extraction' : f.type === 'conflict' ? 'conflicting_values' : 'suggested_correction'
  return {
    id: `aif_${f.id}`,
    title: f.title,
    category,
    severity: f.confidence < 45 ? 'critical' : f.confidence < 70 ? 'warning' : 'info',
    status: f.confidence < 70 ? 'needs_review' : 'high_confidence',
    confidence: f.confidence,
    confidenceReasons: f.confidence >= 85 ? ['Source document matched', 'Field structure recognized', 'Value passed validation'] : [],
    uncertaintyReasons: f.confidence < 85 ? [f.description] : undefined,
    explanation: f.description,
    evidence: trace?.sourceExcerpt ? [{ label: 'Source', value: trace.sourceExcerpt, sourceDocumentId: trace.sourceDocumentId }] : [],
    recommendation: { label: 'Review discrepancy', action: 'review_discrepancy' },
    returnId: RETURN_ID,
    clientId: CLIENT_ID,
    relatedFieldId: trace?.id,
    reviewHistory: [],
    timeline: [],
    createdAt: trace?.timeline[0]?.timestamp ?? '2026-08-01T00:00:00.000Z',
  } satisfies AIFinding
})

export const aiFindings: AIFinding[] = [...flagshipFindings, ...suggestionFindings, ...generatedFindings]

export function getAIFindingById(id: string): AIFinding | undefined {
  return aiFindings.find((f) => f.id === id)
}

export function getAIFindingsByReturnId(returnId: string): AIFinding[] {
  return aiFindings.filter((f) => f.returnId === returnId)
}
