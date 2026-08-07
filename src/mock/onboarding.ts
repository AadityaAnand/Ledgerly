import type { ClientOnboardingProfile } from '@/types'

export const onboardingProfiles: ClientOnboardingProfile[] = [
  {
    clientId: 'cli_8',
    returnId: 'ret_8',
    steps: [
      { id: 'account_created', label: 'Account created', status: 'complete', completedAt: '2026-07-22T14:00:00.000Z' },
      {
        id: 'identity_verified',
        label: 'Identity verified',
        status: 'complete',
        completedAt: '2026-07-22T14:12:00.000Z',
      },
      {
        id: 'personal_info',
        label: 'Personal information',
        status: 'complete',
        completedAt: '2026-07-23T09:30:00.000Z',
      },
      { id: 'upload_w2', label: 'Upload W-2', status: 'upcoming' },
      { id: 'upload_1099', label: 'Upload 1099', status: 'upcoming' },
      { id: 'questionnaire', label: 'Complete questionnaire', status: 'upcoming' },
      { id: 'review_return', label: 'Review return', status: 'upcoming' },
      { id: 'sign_return', label: 'Sign return', status: 'upcoming' },
    ],
    nextActions: [
      {
        stepId: 'upload_w2',
        title: 'Upload your W-2',
        description:
          'We need your W-2 from your employer to get started on your return. Snap a photo or upload a PDF — our AI will pull the numbers automatically.',
        estimatedMinutes: 2,
        priority: 'high',
        ctaLabel: 'Upload W-2',
        icon: 'upload',
      },
      {
        stepId: 'upload_1099',
        title: 'Upload your 1099',
        description:
          'If you did any freelance or contract work this year, upload the 1099 you received so we can include that income.',
        estimatedMinutes: 2,
        priority: 'medium',
        ctaLabel: 'Upload 1099',
        icon: 'upload',
      },
      {
        stepId: 'questionnaire',
        title: 'Complete your tax questionnaire',
        description:
          'A few quick questions about your year — dependents, major life changes, and deductions — help us prepare an accurate return.',
        estimatedMinutes: 8,
        priority: 'medium',
        ctaLabel: 'Start questionnaire',
        icon: 'questionnaire',
      },
      {
        stepId: 'review_return',
        title: 'Review your AI-extracted information',
        description:
          'Take a look at what we pulled from your documents and confirm everything looks right before we finalize your return.',
        estimatedMinutes: 5,
        priority: 'medium',
        ctaLabel: 'Review information',
        icon: 'review',
      },
      {
        stepId: 'sign_return',
        title: 'Sign your authorization',
        description: 'Your return is ready. Review the final numbers and sign electronically to authorize e-filing.',
        estimatedMinutes: 3,
        priority: 'high',
        ctaLabel: 'Review & sign',
        icon: 'sign',
      },
    ],
    requiredDocuments: [
      { id: 'reqdoc_1', label: 'W-2', category: 'w2', stepId: 'upload_w2', status: 'missing', dueDate: '2026-08-13' },
      {
        id: 'reqdoc_2',
        label: '1099-NEC',
        category: '1099',
        stepId: 'upload_1099',
        status: 'missing',
        dueDate: '2026-08-13',
      },
    ],
    questionnaireQuestions: [
      { id: 'q_1', question: 'Did your marital status change in 2025?', helpText: 'Married, divorced, or widowed this year' },
      { id: 'q_2', question: 'Did you have any dependents in 2025?', helpText: 'Children or other qualifying dependents' },
      { id: 'q_3', question: 'Did you buy or sell a home in 2025?' },
      { id: 'q_4', question: 'Did you make any charitable donations?', helpText: 'Cash or non-cash donations over $250' },
      { id: 'q_5', question: 'Did you have any out-of-pocket medical expenses?' },
    ],
    deadlines: [
      {
        id: 'dl_1',
        label: 'Missing documents due',
        dueDate: '2026-08-13',
        kind: 'documents',
        description: 'W-2 and 1099 still needed',
      },
      {
        id: 'dl_2',
        label: 'CPA review',
        dueDate: '2026-09-19',
        kind: 'review',
        description: 'Devon Ellis reviews your return',
      },
      {
        id: 'dl_3',
        label: 'Filing deadline',
        dueDate: '2026-10-15',
        kind: 'filing',
        description: 'Extended federal filing deadline',
      },
    ],
  },
]

export function getOnboardingProfileByClientId(clientId: string): ClientOnboardingProfile | undefined {
  return onboardingProfiles.find((p) => p.clientId === clientId)
}
