import type { ReviewHistoryEntry, TaxFieldTrace, TraceabilityTimelineEvent } from '@/types'

const RETURN_ID = 'ret_1'
const PREPARER_ID = 'usr_2' // Marcus Webb
const REVIEWER_ID = 'usr_3' // Priya Nathan

function at(baseIso: string, minutesOffset: number): string {
  return new Date(new Date(baseIso).getTime() + minutesOffset * 60_000).toISOString()
}

/** The AI pipeline steps every extracted (non-calculated) field goes through. */
function extractionTimeline(
  fieldId: string,
  baseIso: string,
  docName: string,
  confidence: number
): TraceabilityTimelineEvent[] {
  return [
    {
      id: `${fieldId}_evt_uploaded`,
      type: 'uploaded',
      label: 'Document uploaded',
      description: `${docName} was added to the client's document library.`,
      timestamp: at(baseIso, 0),
    },
    {
      id: `${fieldId}_evt_processing`,
      type: 'processing',
      label: 'AI processing started',
      description: 'Ledgerly AI queued the document for extraction.',
      timestamp: at(baseIso, 2),
    },
    {
      id: `${fieldId}_evt_extracted`,
      type: 'extracted',
      label: 'Value extracted',
      description: `Raw value read from ${docName}.`,
      timestamp: at(baseIso, 4),
    },
    {
      id: `${fieldId}_evt_normalized`,
      type: 'normalized',
      label: 'Value normalized',
      description: 'Formatted and mapped to the correct return line.',
      timestamp: at(baseIso, 5),
    },
    {
      id: `${fieldId}_evt_confidence`,
      type: 'confidence_scored',
      label: 'Confidence scored',
      description: `Assigned a confidence score of ${confidence}%.`,
      timestamp: at(baseIso, 6),
    },
  ]
}

/** The pipeline steps a pure-calculation field (no single source document) goes through. */
function calculationTimeline(
  fieldId: string,
  baseIso: string,
  formula: string,
  confidence: number
): TraceabilityTimelineEvent[] {
  return [
    {
      id: `${fieldId}_evt_processing`,
      type: 'processing',
      label: 'Calculation started',
      description: 'Ledgerly AI began computing this value from upstream return data.',
      timestamp: at(baseIso, 0),
    },
    {
      id: `${fieldId}_evt_calculated`,
      type: 'calculated',
      label: 'Value calculated',
      description: `Applied formula: ${formula}`,
      timestamp: at(baseIso, 1),
    },
    {
      id: `${fieldId}_evt_confidence`,
      type: 'confidence_scored',
      label: 'Confidence scored',
      description: `Assigned a confidence score of ${confidence}%.`,
      timestamp: at(baseIso, 2),
    },
  ]
}

function approvedEvent(fieldId: string, timestamp: string): TraceabilityTimelineEvent {
  return {
    id: `${fieldId}_evt_approved`,
    type: 'approved',
    label: 'Approved by reviewer',
    description: 'Priya Nathan approved this value during review.',
    timestamp,
  }
}

function reviewStartedEvent(fieldId: string, timestamp: string): TraceabilityTimelineEvent {
  return {
    id: `${fieldId}_evt_review_started`,
    type: 'review_started',
    label: 'Review started',
    description: 'Queued for human review before this return can be filed.',
    timestamp,
  }
}

function flaggedEvent(fieldId: string, description: string, timestamp: string): TraceabilityTimelineEvent {
  return {
    id: `${fieldId}_evt_flagged`,
    type: 'flagged',
    label: 'Flagged for review',
    description,
    timestamp,
  }
}

function editedEvent(fieldId: string, description: string, timestamp: string): TraceabilityTimelineEvent {
  return { id: `${fieldId}_evt_edited`, type: 'edited', label: 'Value corrected', description, timestamp }
}

function approvedHistory(id: string, note: string, timestamp: string): ReviewHistoryEntry[] {
  return [{ id, actorId: REVIEWER_ID, action: 'approved', note, timestamp }]
}

export const taxFieldTraces: TaxFieldTrace[] = [
  // ─────────────────────────── Income ───────────────────────────
  {
    id: 'business_income',
    returnId: RETURN_ID,
    category: 'income',
    label: 'Business Income',
    formLine: 'Schedule C, Line 1',
    value: 142_850,
    verification: 'verified',
    confidence: 96,
    sourceDocumentId: 'doc-pl',
    sourceFieldId: 'pl-total-revenue',
    sourceExcerpt: 'Total Revenue — $142,850.00',
    isCalculated: false,
    aiExplanation:
      "Extracted from the Total Revenue line of Bennett Design Studio's FY2025 profit & loss statement, combining consulting and product sales revenue.",
    transformationSteps: [
      "Read the 'Total Revenue' line from the P&L statement",
      'Verified it equals the sum of Consulting Revenue and Product Sales Revenue',
      'Mapped to Schedule C, Line 1',
    ],
    calculationFormula: '$118,400.00 (Consulting) + $24,450.00 (Product Sales) = $142,850.00',
    assumptions: ['P&L statement reflects the full fiscal year with no unposted revenue'],
    validationRules: [
      { label: 'Matches P&L total revenue line', passed: true },
      { label: 'Consistent with prior-year growth trend', passed: true },
    ],
    reviewerId: REVIEWER_ID,
    reviewedAt: '2026-08-01T11:20:00.000Z',
    reviewHistory: approvedHistory('rh_bi_1', 'Reconciles cleanly with the P&L.', '2026-08-01T11:20:00.000Z'),
    timeline: [
      ...extractionTimeline('business_income', '2026-07-18T09:00:00.000Z', 'the P&L statement', 96),
      reviewStartedEvent('business_income', '2026-08-01T11:15:00.000Z'),
      approvedEvent('business_income', '2026-08-01T11:20:00.000Z'),
    ],
  },
  {
    id: 'business_expenses',
    returnId: RETURN_ID,
    category: 'income',
    label: 'Business Expenses',
    formLine: 'Schedule C, Line 28',
    value: 58_200,
    verification: 'verified',
    confidence: 94,
    sourceDocumentId: 'doc-pl',
    sourceFieldId: 'pl-total-expenses',
    sourceExcerpt: 'Total Operating Expenses — $58,200.00',
    isCalculated: false,
    aiExplanation:
      'Summed all operating expense line items from the P&L statement — software, contractors, rent, marketing, and insurance.',
    transformationSteps: [
      'Read each expense line item from the P&L',
      'Summed five expense categories',
      'Mapped to Schedule C, Line 28',
    ],
    calculationFormula: '$8,200 + $22,100 + $18,000 + $6,400 + $3,500 = $58,200.00',
    validationRules: [
      { label: 'Sum matches P&L subtotal', passed: true },
      { label: 'No expense category exceeds 40% of revenue', passed: true },
    ],
    reviewerId: REVIEWER_ID,
    reviewedAt: '2026-08-01T11:22:00.000Z',
    reviewHistory: approvedHistory('rh_be_1', 'Matches the expense ledger.', '2026-08-01T11:22:00.000Z'),
    timeline: [
      ...extractionTimeline('business_expenses', '2026-07-18T09:00:00.000Z', 'the P&L statement', 94),
      approvedEvent('business_expenses', '2026-08-01T11:22:00.000Z'),
    ],
  },
  {
    id: 'interest_income',
    returnId: RETURN_ID,
    category: 'income',
    label: 'Interest Income',
    formLine: 'Form 1040, Line 2b',
    value: 1_240,
    verification: 'verified',
    confidence: 98,
    sourceDocumentId: 'doc-1099int',
    sourceFieldId: '1099int-box1',
    sourceExcerpt: 'Box 1 Interest income — $1,240.00',
    isCalculated: false,
    aiExplanation: 'Directly extracted from Box 1 of the 1099-INT issued by Chase Bank.',
    transformationSteps: ['Read Box 1 value from the 1099-INT', 'Mapped to Form 1040, Line 2b'],
    validationRules: [{ label: 'Matches 1099-INT Box 1 exactly', passed: true }],
    reviewerId: REVIEWER_ID,
    reviewedAt: '2026-08-01T11:25:00.000Z',
    reviewHistory: approvedHistory('rh_ii_1', 'Clean extraction, single source.', '2026-08-01T11:25:00.000Z'),
    timeline: [
      ...extractionTimeline('interest_income', '2026-07-21T09:00:00.000Z', 'the 1099-INT', 98),
      approvedEvent('interest_income', '2026-08-01T11:25:00.000Z'),
    ],
  },
  {
    id: 'dividend_income',
    returnId: RETURN_ID,
    category: 'income',
    label: 'Dividend Income',
    formLine: 'Form 1040, Line 3b',
    value: 4_380,
    verification: 'verified',
    confidence: 97,
    sourceDocumentId: 'doc-1099div',
    sourceFieldId: '1099div-box1a',
    sourceExcerpt: 'Box 1a Total ordinary dividends — $4,380.00',
    isCalculated: false,
    aiExplanation: 'Directly extracted from Box 1a of the 1099-DIV issued by Fidelity Investments.',
    transformationSteps: ['Read Box 1a from the 1099-DIV', 'Mapped to Form 1040, Line 3b'],
    validationRules: [{ label: 'Matches 1099-DIV Box 1a exactly', passed: true }],
    reviewerId: REVIEWER_ID,
    reviewedAt: '2026-08-01T11:27:00.000Z',
    reviewHistory: approvedHistory('rh_di_1', 'Clean extraction, single source.', '2026-08-01T11:27:00.000Z'),
    timeline: [
      ...extractionTimeline('dividend_income', '2026-07-21T09:05:00.000Z', 'the 1099-DIV', 97),
      approvedEvent('dividend_income', '2026-08-01T11:27:00.000Z'),
    ],
  },
  {
    id: 'qualified_dividends',
    returnId: RETURN_ID,
    category: 'income',
    label: 'Qualified Dividends',
    formLine: 'Form 1040, Line 3a',
    value: 3_900,
    verification: 'verified',
    confidence: 93,
    sourceDocumentId: 'doc-1099div',
    sourceFieldId: '1099div-box1b',
    sourceExcerpt: 'Box 1b Qualified dividends — $3,900.00',
    isCalculated: false,
    aiExplanation:
      'Extracted from Box 1b. Qualified dividends are a subset of total ordinary dividends and are taxed at the lower long-term capital gains rate.',
    transformationSteps: [
      'Read Box 1b from the 1099-DIV',
      'Confirmed the value does not exceed the Box 1a total',
      'Mapped to Form 1040, Line 3a',
    ],
    validationRules: [
      { label: 'Does not exceed total ordinary dividends (Line 3b)', passed: true },
      { label: 'Matches 1099-DIV Box 1b exactly', passed: true },
    ],
    reviewerId: REVIEWER_ID,
    reviewedAt: '2026-08-01T11:28:00.000Z',
    reviewHistory: approvedHistory('rh_qd_1', 'Consistent with Box 1a.', '2026-08-01T11:28:00.000Z'),
    timeline: [
      ...extractionTimeline('qualified_dividends', '2026-07-21T09:05:00.000Z', 'the 1099-DIV', 93),
      approvedEvent('qualified_dividends', '2026-08-01T11:28:00.000Z'),
    ],
  },
  {
    id: 'capital_gains',
    returnId: RETURN_ID,
    category: 'income',
    label: 'Capital Gains',
    formLine: 'Schedule D, Line 16',
    value: 12_650,
    verification: 'needs_review',
    confidence: 71,
    sourceDocumentId: 'doc-1099b',
    sourceFieldId: '1099b-total-gain',
    sourceExcerpt: 'Total Net Capital Gain — $12,650.00',
    isCalculated: false,
    aiExplanation:
      'Summed net gains across three lots reported on the 1099-B. One lot (MSFT) is flagged for a potential wash sale that would need to be excluded or adjusted.',
    transformationSteps: [
      'Read proceeds and cost basis for each lot from the 1099-B',
      'Computed gain per lot: proceeds − cost basis',
      'Summed three lots for Schedule D, Line 16',
      'Cross-checked repurchase activity in the brokerage statement — none found within the 30-day window',
    ],
    calculationFormula: '$7,150.00 + $3,400.00 + $2,100.00 = $12,650.00',
    assumptions: ['All three lots are long-term (held over 1 year)'],
    risks: [
      'The MSFT lot sold 07/02/2025 may trigger a wash sale if a repurchase occurred within 30 days — none was found in the linked brokerage statement, but this should be confirmed directly with the client.',
    ],
    suggestedAction:
      'Confirm with the client that no MSFT shares were repurchased within 30 days of the 07/02 sale.',
    validationRules: [
      { label: 'Sum matches 1099-B total', passed: true },
      { label: 'No wash sale activity detected in linked accounts', passed: false },
    ],
    reviewHistory: [],
    timeline: [
      ...extractionTimeline('capital_gains', '2026-07-21T09:10:00.000Z', 'the 1099-B', 71),
      flaggedEvent(
        'capital_gains',
        'Possible wash sale on the MSFT lot — needs preparer confirmation.',
        '2026-07-21T09:16:00.000Z'
      ),
    ],
  },
  {
    id: 'rental_income',
    returnId: RETURN_ID,
    category: 'income',
    label: 'Rental Income',
    formLine: 'Schedule E, Line 3',
    value: 18_000,
    originalValue: 16_200,
    verification: 'overridden',
    confidence: 62,
    sourceDocumentId: 'doc-bankstatement',
    sourceFieldId: 'bank-rental-total',
    sourceExcerpt: 'Total Rental Deposits (12 mo.) — $18,000.00',
    isCalculated: false,
    aiExplanation:
      "AI identified recurring monthly deposits from Riverside Property Mgmt in the business checking account and summed twelve months of activity. The preparer manually corrected the total after finding two deposits the AI hadn't matched.",
    transformationSteps: [
      'Scanned 12 months of bank statement transactions',
      "Pattern-matched 10 deposits against the description 'Riverside Property Mgmt'",
      'Summed 10 matched deposits: $16,200 initial AI estimate',
      'Preparer manually located 2 additional deposits posted under a shortened memo and added $1,800 twice ($3,000 combined difference)',
    ],
    risks: ['Two deposits were not auto-matched due to an abbreviated payer name on the statement.'],
    suggestedAction: 'Confirm the full 12-month deposit history against the lease agreement before filing.',
    validationRules: [
      { label: 'Matches manually verified deposit count (12 of 12 months)', passed: true },
      { label: 'AI-extracted total matched without correction', passed: false },
    ],
    reviewerId: PREPARER_ID,
    reviewedAt: '2026-08-03T14:10:00.000Z',
    reviewHistory: [
      {
        id: 'rh_ri_1',
        actorId: PREPARER_ID,
        action: 'edited',
        note: 'Found 2 more Riverside Property Mgmt deposits under a shortened memo — added $1,800.',
        timestamp: '2026-08-03T14:10:00.000Z',
        previousValue: 16_200,
        newValue: 18_000,
      },
    ],
    timeline: [
      ...extractionTimeline('rental_income', '2026-08-01T09:00:00.000Z', 'the bank statement', 62),
      editedEvent(
        'rental_income',
        'Marcus Webb corrected the total from $16,200 to $18,000 after locating two missed deposits.',
        '2026-08-03T14:10:00.000Z'
      ),
    ],
  },

  // ─────────────────────────── Deductions ───────────────────────────
  {
    id: 'mortgage_interest',
    returnId: RETURN_ID,
    category: 'deductions',
    label: 'Mortgage Interest',
    formLine: 'Schedule A, Line 8a',
    value: 18_420,
    verification: 'verified',
    confidence: 95,
    sourceDocumentId: 'doc-mortgage',
    sourceFieldId: 'mortgage-box1',
    sourceExcerpt: 'Box 1 Mortgage interest received — $18,420.00',
    isCalculated: false,
    aiExplanation: 'Directly extracted from Box 1 of Form 1098 issued by Summit Bank.',
    transformationSteps: ['Read Box 1 from Form 1098', 'Mapped to Schedule A, Line 8a'],
    validationRules: [{ label: 'Matches Form 1098 Box 1 exactly', passed: true }],
    reviewerId: REVIEWER_ID,
    reviewedAt: '2026-08-01T11:30:00.000Z',
    reviewHistory: approvedHistory('rh_mi_1', 'Clean extraction, single source.', '2026-08-01T11:30:00.000Z'),
    timeline: [
      ...extractionTimeline('mortgage_interest', '2026-07-19T09:00:00.000Z', 'Form 1098', 95),
      approvedEvent('mortgage_interest', '2026-08-01T11:30:00.000Z'),
    ],
  },
  {
    id: 'property_tax',
    returnId: RETURN_ID,
    category: 'deductions',
    label: 'Property Tax',
    formLine: 'Schedule A, Line 5b',
    value: 9_800,
    verification: 'verified',
    confidence: 96,
    sourceDocumentId: 'doc-propertytax',
    sourceFieldId: 'proptax-total',
    sourceExcerpt: 'Total Property Tax Paid — $9,800.00',
    isCalculated: false,
    aiExplanation: 'Summed both installment payments from the San Mateo County property tax statement.',
    transformationSteps: [
      'Read First and Second Installment amounts',
      'Summed both installments',
      'Mapped to Schedule A, Line 5b',
    ],
    calculationFormula: '$4,900.00 + $4,900.00 = $9,800.00',
    validationRules: [
      { label: 'Matches county statement total', passed: true },
      { label: 'Within SALT deduction cap alongside state tax paid', passed: true },
    ],
    reviewerId: REVIEWER_ID,
    reviewedAt: '2026-08-01T11:32:00.000Z',
    reviewHistory: approvedHistory('rh_pt_1', 'Both installments accounted for.', '2026-08-01T11:32:00.000Z'),
    timeline: [
      ...extractionTimeline('property_tax', '2026-07-19T09:20:00.000Z', 'the property tax statement', 96),
      approvedEvent('property_tax', '2026-08-01T11:32:00.000Z'),
    ],
  },
  {
    id: 'charitable_donations',
    returnId: RETURN_ID,
    category: 'deductions',
    label: 'Charitable Donations',
    formLine: 'Schedule A, Line 11',
    value: 4_250,
    verification: 'verified',
    confidence: 92,
    sourceDocumentId: 'doc-donation',
    sourceFieldId: 'donation-total',
    sourceExcerpt: 'Total Contributions for 2025 — $4,250.00',
    isCalculated: false,
    aiExplanation:
      'Summed four contributions — three cash, one non-cash — from the Bay Area Food Bank donation receipt.',
    transformationSteps: [
      'Read four individual donation line items',
      'Summed cash and non-cash contributions',
      'Mapped to Schedule A, Line 11',
    ],
    calculationFormula: '$1,000 + $1,250 + $500 + $1,500 = $4,250.00',
    validationRules: [
      { label: 'Matches donation receipt total', passed: true },
      { label: 'Non-cash portion under $5,000 (no Form 8283 required)', passed: true },
    ],
    reviewerId: REVIEWER_ID,
    reviewedAt: '2026-08-01T11:34:00.000Z',
    reviewHistory: approvedHistory(
      'rh_cd_1',
      'Receipt is itemized and complete.',
      '2026-08-01T11:34:00.000Z'
    ),
    timeline: [
      ...extractionTimeline('charitable_donations', '2026-07-19T09:10:00.000Z', 'the donation receipt', 92),
      approvedEvent('charitable_donations', '2026-08-01T11:34:00.000Z'),
    ],
  },
  {
    id: 'medical_expenses',
    returnId: RETURN_ID,
    category: 'deductions',
    label: 'Medical Expenses',
    formLine: 'Schedule A, Line 1',
    value: 6_180,
    verification: 'needs_review',
    confidence: 58,
    sourceDocumentId: 'doc-bankstatement',
    sourceFieldId: 'bank-medical-total',
    sourceExcerpt: 'Total Medical Expenses (est.) — $6,180.00',
    isCalculated: false,
    aiExplanation:
      'AI identified four transactions in the bank statement matching known healthcare-provider merchant names and summed them. This deduction is only usable if total medical expenses exceed 7.5% of AGI, which has not yet been confirmed.',
    transformationSteps: [
      'Scanned the bank statement for merchant names matching known healthcare providers',
      'Matched 4 transactions across the year',
      'Summed the matched transactions',
    ],
    risks: [
      'Expenses were inferred from merchant names, not itemized receipts — some transactions could include non-deductible items.',
      'Does not yet account for the 7.5%-of-AGI floor.',
    ],
    suggestedAction:
      'Request itemized medical receipts from the client and confirm the AGI floor before including this deduction.',
    validationRules: [
      { label: 'All transactions matched a known provider category', passed: true },
      { label: 'Confirmed against itemized receipts', passed: false },
    ],
    reviewHistory: [],
    timeline: [
      ...extractionTimeline('medical_expenses', '2026-08-01T09:00:00.000Z', 'the bank statement', 58),
      flaggedEvent(
        'medical_expenses',
        'Inferred from merchant names — needs receipt confirmation.',
        '2026-08-01T09:08:00.000Z'
      ),
    ],
  },
  {
    id: 'ira_contributions',
    returnId: RETURN_ID,
    category: 'deductions',
    label: 'IRA Contributions',
    formLine: 'Schedule 1, Line 20',
    value: 7_000,
    verification: 'verified',
    confidence: 91,
    sourceDocumentId: 'doc-brokerage',
    sourceFieldId: 'brokerage-ira-contribution',
    sourceExcerpt: 'IRA Contribution — 04/12/2025 — $7,000.00',
    isCalculated: false,
    aiExplanation:
      'Identified a single IRA contribution transaction in the Fidelity brokerage statement, made before the filing deadline for the 2025 tax year.',
    transformationSteps: [
      'Scanned the brokerage statement for contribution-coded transactions',
      'Matched one contribution dated 04/12/2025',
      'Confirmed it falls within the 2025 contribution window',
    ],
    validationRules: [
      { label: 'Within annual IRA contribution limit ($7,000 for under 50)', passed: true },
      { label: 'Contribution dated within the allowed window', passed: true },
    ],
    reviewerId: REVIEWER_ID,
    reviewedAt: '2026-08-02T10:05:00.000Z',
    reviewHistory: approvedHistory('rh_ira_1', 'Within limit, properly dated.', '2026-08-02T10:05:00.000Z'),
    timeline: [
      ...extractionTimeline('ira_contributions', '2026-07-22T09:00:00.000Z', 'the brokerage statement', 91),
      approvedEvent('ira_contributions', '2026-08-02T10:05:00.000Z'),
    ],
  },
  {
    id: 'student_loan_interest',
    returnId: RETURN_ID,
    category: 'deductions',
    label: 'Student Loan Interest',
    formLine: 'Schedule 1, Line 21',
    value: 0,
    verification: 'unverified',
    confidence: 0,
    isCalculated: false,
    aiExplanation:
      'No Form 1098-E has been uploaded for this client. Ledgerly cannot confirm whether a student loan interest deduction applies.',
    transformationSteps: [],
    risks: ['If the client paid student loan interest in 2025, this deduction may be missed entirely.'],
    suggestedAction:
      'Ask the client whether they paid student loan interest in 2025 and request Form 1098-E if so.',
    validationRules: [{ label: 'Source document on file', passed: false }],
    reviewHistory: [],
    timeline: [
      {
        id: 'student_loan_interest_evt_awaiting',
        type: 'processing',
        label: 'Awaiting source document',
        description: 'No Form 1098-E has been uploaded yet — nothing to extract.',
        timestamp: '2026-07-30T09:00:00.000Z',
      },
    ],
  },

  // ─────────────────────── Payments & Credits ───────────────────────
  {
    id: 'federal_tax_withheld',
    returnId: RETURN_ID,
    category: 'payments_credits',
    label: 'Federal Tax Paid',
    formLine: 'Form 1040, Line 25a',
    value: 2_850,
    verification: 'verified',
    confidence: 99,
    sourceDocumentId: 'doc-w2',
    sourceFieldId: 'w2-box2',
    sourceExcerpt: 'Box 2 Federal income tax withheld — $2,850.00',
    isCalculated: false,
    aiExplanation: 'Directly extracted from Box 2 of the W-2 issued by Presidio Marketing Group.',
    transformationSteps: ['Read Box 2 from the W-2', 'Mapped to Form 1040, Line 25a'],
    validationRules: [{ label: 'Matches W-2 Box 2 exactly', passed: true }],
    reviewerId: REVIEWER_ID,
    reviewedAt: '2026-08-01T11:36:00.000Z',
    reviewHistory: approvedHistory(
      'rh_ftw_1',
      'Clean extraction, single source.',
      '2026-08-01T11:36:00.000Z'
    ),
    timeline: [
      ...extractionTimeline('federal_tax_withheld', '2026-07-20T09:00:00.000Z', 'the W-2', 99),
      approvedEvent('federal_tax_withheld', '2026-08-01T11:36:00.000Z'),
    ],
  },
  {
    id: 'state_tax_paid',
    returnId: RETURN_ID,
    category: 'payments_credits',
    label: 'State Tax Paid',
    formLine: 'Schedule A, Line 5a',
    value: 11_200,
    verification: 'verified',
    confidence: 88,
    isCalculated: true,
    aiExplanation:
      'Calculated by combining state income tax withheld from the W-2 with state estimated payments identified in the bank statement, since no single document reports the full-year total.',
    transformationSteps: [
      'Read state withholding from W-2 Box 17: $2,340.00',
      'Identified state estimated tax transfers in the bank statement: $8,860.00',
      'Summed both sources for the full-year total',
    ],
    calculationFormula: '$2,340.00 (W-2 withholding) + $8,860.00 (estimated payments) = $11,200.00',
    assumptions: [
      'Estimated payment transfers were correctly categorized as state, not federal, tax payments',
    ],
    validationRules: [
      { label: 'Withholding matches W-2 Box 17', passed: true },
      { label: 'Estimated payment total confirmed in bank statement', passed: true },
    ],
    reviewerId: REVIEWER_ID,
    reviewedAt: '2026-08-02T10:10:00.000Z',
    reviewHistory: approvedHistory('rh_stp_1', 'Both components verified.', '2026-08-02T10:10:00.000Z'),
    timeline: [
      ...calculationTimeline(
        'state_tax_paid',
        '2026-08-01T09:30:00.000Z',
        'W-2 Box 17 + bank statement estimated payments',
        88
      ),
      approvedEvent('state_tax_paid', '2026-08-02T10:10:00.000Z'),
    ],
  },
  {
    id: 'estimated_payments',
    returnId: RETURN_ID,
    category: 'payments_credits',
    label: 'Estimated Payments',
    formLine: 'Form 1040, Line 26',
    value: 16_000,
    verification: 'verified',
    confidence: 94,
    sourceDocumentId: 'doc-bankstatement',
    sourceFieldId: 'bank-estimated-total',
    sourceExcerpt: 'Total Estimated Tax Payments — $16,000.00',
    isCalculated: false,
    aiExplanation: 'Identified four quarterly transfers to the IRS in the bank statement and summed them.',
    transformationSteps: [
      "Scanned the bank statement for transfers labeled 'IRS' or 'Estimated'",
      'Matched four quarterly transfers of $4,000 each',
      'Summed all four',
    ],
    calculationFormula: '$4,000 × 4 quarters = $16,000.00',
    validationRules: [
      { label: 'Four payments found, matching quarterly schedule', passed: true },
      { label: 'Amounts consistent quarter over quarter', passed: true },
    ],
    reviewerId: REVIEWER_ID,
    reviewedAt: '2026-08-02T10:12:00.000Z',
    reviewHistory: approvedHistory('rh_ep_1', 'All four quarters accounted for.', '2026-08-02T10:12:00.000Z'),
    timeline: [
      ...extractionTimeline('estimated_payments', '2026-08-01T09:00:00.000Z', 'the bank statement', 94),
      approvedEvent('estimated_payments', '2026-08-02T10:12:00.000Z'),
    ],
  },
  {
    id: 'social_security_benefits',
    returnId: RETURN_ID,
    category: 'payments_credits',
    label: 'Social Security Benefits',
    formLine: 'Form 1040, Line 6a',
    value: 14_280,
    verification: 'needs_review',
    confidence: 54,
    sourceDocumentId: 'doc-bankstatement',
    sourceFieldId: 'bank-ssa-total',
    sourceExcerpt: 'Total SSA Deposits (12 mo.) — $14,280.00',
    isCalculated: false,
    aiExplanation:
      "No SSA-1099 has been uploaded. AI inferred this value from twelve recurring Treasury deposits in the bank statement labeled 'SSA Treasury Deposit,' which strongly suggests Social Security income — but the official form is needed to confirm the exact taxable amount.",
    transformationSteps: [
      'Scanned the bank statement for recurring Treasury deposits',
      'Identified 12 monthly deposits of $1,190.00 each',
      'Summed twelve months',
    ],
    calculationFormula: '$1,190.00 × 12 = $14,280.00',
    risks: [
      'Without the SSA-1099, Ledgerly cannot confirm the exact benefit amount or whether any portion was withheld for Medicare premiums.',
    ],
    suggestedAction:
      'Request Form SSA-1099 from the client to confirm the exact benefit and withholding amounts.',
    validationRules: [
      { label: 'Deposit pattern consistent with a monthly SSA benefit', passed: true },
      { label: 'Confirmed against official SSA-1099', passed: false },
    ],
    reviewHistory: [],
    timeline: [
      ...extractionTimeline('social_security_benefits', '2026-08-01T09:00:00.000Z', 'the bank statement', 54),
      flaggedEvent(
        'social_security_benefits',
        'Inferred from deposit pattern — official SSA-1099 not on file.',
        '2026-08-01T09:09:00.000Z'
      ),
    ],
  },
  {
    id: 'k1_passthrough_income',
    returnId: RETURN_ID,
    category: 'payments_credits',
    label: 'K-1 Pass-Through Income',
    formLine: 'Schedule E, Line 28',
    value: 9_450,
    verification: 'flagged',
    confidence: 68,
    sourceDocumentId: 'doc-k1',
    sourceFieldId: 'k1-line1',
    sourceExcerpt: 'Line 1 Ordinary business income — $9,450.00',
    isCalculated: false,
    hasConflict: true,
    conflictNote:
      "Riverside Ventures LLC reported Laura's profit-sharing allocation at 32.00% this year, up from 28.00% on the 2024 K-1. No amended partnership agreement is on file to support the change.",
    aiExplanation:
      'Extracted from Line 1 of the Schedule K-1. The reported allocation percentage increased year-over-year without a corresponding amendment, which could indicate a data entry error at the partnership level or an unreported ownership change.',
    transformationSteps: [
      'Read Line 1 ordinary business income from the K-1',
      "Compared the reported allocation % against last year's K-1 on file",
      'Flagged a 4-point allocation increase with no supporting documentation',
    ],
    risks: [
      'If the allocation change is an error, the correct income figure could be materially different.',
      'An unreported ownership change could carry other tax implications for the client.',
    ],
    suggestedAction:
      "Contact Riverside Ventures LLC's accountant to confirm whether the allocation change is intentional before filing.",
    validationRules: [
      { label: 'Matches K-1 Line 1 exactly', passed: true },
      { label: 'Allocation % consistent with prior year', passed: false },
    ],
    reviewHistory: [],
    timeline: [
      ...extractionTimeline('k1_passthrough_income', '2026-07-29T16:00:00.000Z', 'the Schedule K-1', 68),
      flaggedEvent(
        'k1_passthrough_income',
        'Allocation percentage changed year-over-year without an amendment on file.',
        '2026-07-29T16:07:00.000Z'
      ),
    ],
  },

  // ─────────────────────────── Tax Summary ───────────────────────────
  {
    id: 'self_employment_tax',
    returnId: RETURN_ID,
    category: 'tax_summary',
    label: 'Self-Employment Tax',
    formLine: 'Schedule 2, Line 4',
    value: 12_006,
    verification: 'verified',
    confidence: 97,
    isCalculated: true,
    aiExplanation:
      'Calculated automatically from net Schedule C income using the standard 15.3% self-employment tax rate applied to 92.35% of net earnings.',
    transformationSteps: [
      'Computed net Schedule C income: $142,850 − $58,200 = $84,650',
      'Applied the 92.35% SE tax base: $84,650 × 0.9235 = $78,174.28',
      'Applied the 15.3% SE tax rate: $78,174.28 × 0.153 = $11,960.66',
      'Rounded and reconciled to the IRS Schedule SE worksheet: $12,006',
    ],
    calculationFormula: '($142,850 − $58,200) × 0.9235 × 15.3% = $12,006.00',
    assumptions: ['No prior-year SE tax carryover', 'No W-2 Social Security wage offset applied yet'],
    validationRules: [
      { label: 'Formula matches the IRS Schedule SE worksheet', passed: true },
      { label: 'Net earnings exceed the $400 filing threshold', passed: true },
    ],
    reviewerId: REVIEWER_ID,
    reviewedAt: '2026-08-02T09:00:00.000Z',
    reviewHistory: approvedHistory(
      'rh_set_1',
      'Formula checks out against the SE worksheet.',
      '2026-08-02T09:00:00.000Z'
    ),
    timeline: [
      ...calculationTimeline(
        'self_employment_tax',
        '2026-08-01T11:23:00.000Z',
        'net Schedule C income × 92.35% × 15.3%',
        97
      ),
      approvedEvent('self_employment_tax', '2026-08-02T09:00:00.000Z'),
    ],
  },
  {
    id: 'tax_due',
    returnId: RETURN_ID,
    category: 'tax_summary',
    label: 'Tax Due',
    formLine: 'Form 1040, Line 37',
    value: 8_340,
    verification: 'needs_review',
    confidence: 89,
    isCalculated: true,
    aiExplanation:
      'Calculated as the final balance due after applying all income, deductions, credits, and payments already reviewed on this return. This figure will change if any of the three still-pending fields above are adjusted.',
    transformationSteps: [
      'Summed total income across all sources',
      'Applied itemized deductions (Schedule A total exceeds the standard deduction)',
      'Computed tax liability using 2025 tax brackets',
      'Added self-employment tax',
      'Subtracted total payments and withholding',
    ],
    calculationFormula: 'Total Tax − Total Payments = $8,340.00',
    risks: [
      'Three upstream fields (Capital Gains, Medical Expenses, K-1 Income) are still pending review — this total may change.',
    ],
    suggestedAction:
      'Resolve the three pending fields above before finalizing this return for client sign-off.',
    validationRules: [
      { label: 'Formula matches the Form 1040 tax computation worksheet', passed: true },
      { label: 'All upstream fields approved', passed: false },
    ],
    reviewHistory: [],
    timeline: [
      ...calculationTimeline('tax_due', '2026-08-04T15:00:00.000Z', 'Total Tax − Total Payments', 89),
      reviewStartedEvent('tax_due', '2026-08-04T15:05:00.000Z'),
    ],
  },
]

export function getTraceById(id: string): TaxFieldTrace | undefined {
  return taxFieldTraces.find((trace) => trace.id === id)
}

export function getTracesByReturnId(returnId: string): TaxFieldTrace[] {
  return taxFieldTraces.filter((trace) => trace.returnId === returnId)
}
