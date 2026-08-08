import type { AISuggestion } from '@/types'

export const aiSuggestions: AISuggestion[] = [
  {
    id: 'ai_1',
    returnId: 'ret_1',
    title: '1099-NEC amount mismatch',
    description:
      'Reported non-employee compensation ($18,400) doesn’t match the uploaded 1099-NEC from Riverside Consulting ($19,650).',
    severity: 'critical',
    category: 'discrepancy',
    resolved: false,
    createdAt: '2026-08-04T16:10:00.000Z',
  },
  {
    id: 'ai_2',
    returnId: 'ret_1',
    title: 'Possible home office deduction',
    description:
      'Utility and rent expenses suggest an eligible home office deduction wasn’t claimed this year.',
    severity: 'info',
    category: 'optimization',
    resolved: false,
    createdAt: '2026-07-29T10:00:00.000Z',
  },
  {
    id: 'ai_3',
    returnId: 'ret_3',
    title: 'K-1 allocation changed year over year',
    description: 'Partnership allocation moved from 28% to 32% without a supporting amendment on file.',
    severity: 'warning',
    category: 'compliance',
    resolved: false,
    createdAt: '2026-07-29T16:05:00.000Z',
  },
  {
    id: 'ai_4',
    returnId: 'ret_3',
    title: 'Missing depreciation on new equipment',
    description: 'A $42,000 equipment purchase in March 2025 doesn’t appear on the depreciation schedule.',
    severity: 'warning',
    category: 'discrepancy',
    resolved: false,
    createdAt: '2026-07-31T11:30:00.000Z',
  },
  {
    id: 'ai_5',
    returnId: 'ret_3',
    title: 'Section 179 election available',
    description: 'Client may qualify for an immediate expense election on qualifying equipment purchases.',
    severity: 'info',
    category: 'optimization',
    resolved: true,
    createdAt: '2026-07-22T09:00:00.000Z',
  },
  {
    id: 'ai_6',
    returnId: 'ret_7',
    title: 'Partner distribution exceeds basis',
    description:
      'One partner’s distribution appears to exceed their tracked basis — may trigger capital gain.',
    severity: 'critical',
    category: 'compliance',
    resolved: false,
    createdAt: '2026-08-01T09:15:00.000Z',
  },
  {
    id: 'ai_7',
    returnId: 'ret_10',
    title: 'W-2 still processing',
    description: 'Uploaded W-2 hasn’t finished OCR extraction — figures below may be incomplete.',
    severity: 'info',
    category: 'discrepancy',
    resolved: false,
    createdAt: '2026-08-03T15:41:00.000Z',
  },
]

export function getAISuggestionsByReturnId(returnId: string): AISuggestion[] {
  return aiSuggestions.filter((s) => s.returnId === returnId)
}

export function getAISuggestionById(id: string): AISuggestion | undefined {
  return aiSuggestions.find((s) => s.id === id)
}
