import type { ID } from './common'
import type { DocumentCategory } from './document'
import type { TaskPriority } from './task'

export type OnboardingStepId =
  | 'account_created'
  | 'identity_verified'
  | 'personal_info'
  | 'upload_w2'
  | 'upload_1099'
  | 'questionnaire'
  | 'review_return'
  | 'sign_return'

export type OnboardingStepStatus = 'complete' | 'upcoming'

export interface OnboardingStep {
  id: OnboardingStepId
  label: string
  status: OnboardingStepStatus
  completedAt?: string
}

export type NextActionIcon = 'upload' | 'questionnaire' | 'review' | 'sign'

export interface NextActionDetail {
  stepId: OnboardingStepId
  title: string
  description: string
  estimatedMinutes: number
  priority: TaskPriority
  ctaLabel: string
  icon: NextActionIcon
}

export type RequiredDocumentStatus = 'missing' | 'uploaded'

export interface RequiredDocument {
  id: ID
  label: string
  category: DocumentCategory
  stepId: OnboardingStepId
  status: RequiredDocumentStatus
  dueDate: string
}

export interface QuestionnaireQuestion {
  id: ID
  question: string
  helpText?: string
}

export type OnboardingDeadlineKind = 'documents' | 'review' | 'filing'

export interface OnboardingDeadline {
  id: ID
  label: string
  dueDate: string
  kind: OnboardingDeadlineKind
  description?: string
}

export interface ClientOnboardingProfile {
  clientId: ID
  returnId: ID
  steps: OnboardingStep[]
  nextActions: NextActionDetail[]
  requiredDocuments: RequiredDocument[]
  questionnaireQuestions: QuestionnaireQuestion[]
  deadlines: OnboardingDeadline[]
}
