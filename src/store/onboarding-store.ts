import { create } from 'zustand'
import type { ClientOnboardingProfile, Document, OnboardingStepId } from '@/types'

const documentLabels: Partial<Record<OnboardingStepId, { name: string; category: Document['category'] }>> = {
  upload_w2: { name: 'W-2 — Grace Kim.pdf', category: 'w2' },
  upload_1099: { name: '1099-NEC — Grace Kim.pdf', category: '1099' },
}

let uploadSeq = 0
function nextDocumentId() {
  uploadSeq += 1
  return `doc_session_${uploadSeq}`
}

interface OnboardingState {
  profile: ClientOnboardingProfile | null
  uploadedDocuments: Document[]
  isLoading: boolean
  completingStepId: OnboardingStepId | null

  initialize: (profile: ClientOnboardingProfile, uploadedDocuments: Document[]) => void
  setLoading: (loading: boolean) => void
  completeStep: (stepId: OnboardingStepId) => void
}

export const useOnboardingStore = create<OnboardingState>()((set, get) => ({
  profile: null,
  uploadedDocuments: [],
  isLoading: true,
  completingStepId: null,

  initialize: (profile, uploadedDocuments) => set({ profile, uploadedDocuments, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),

  completeStep: (stepId) => {
    const { profile } = get()
    if (!profile) return

    set({ completingStepId: stepId })

    setTimeout(() => {
      const current = get().profile
      if (!current) return
      const now = new Date().toISOString()

      const newDocument = documentLabels[stepId]
        ? ({
            id: nextDocumentId(),
            clientId: current.clientId,
            returnId: current.returnId,
            name: documentLabels[stepId]!.name,
            category: documentLabels[stepId]!.category,
            status: 'verified',
            uploadedById: 'usr_13',
            fileSize: 94_000,
            fileType: 'pdf',
            pageCount: 1,
            uploadedAt: now,
            aiExtracted: true,
          } satisfies Document)
        : null

      set((state) => ({
        completingStepId: null,
        profile: state.profile
          ? {
              ...state.profile,
              steps: state.profile.steps.map((step) =>
                step.id === stepId ? { ...step, status: 'complete', completedAt: now } : step
              ),
              requiredDocuments: state.profile.requiredDocuments.map((doc) =>
                doc.stepId === stepId ? { ...doc, status: 'uploaded' } : doc
              ),
            }
          : state.profile,
        uploadedDocuments: newDocument ? [...state.uploadedDocuments, newDocument] : state.uploadedDocuments,
      }))
    }, 700)
  },
}))
