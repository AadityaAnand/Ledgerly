import { create } from 'zustand'
import { aiFindings } from '@/mock/ai-findings'
import type { AIFinding, AIFindingStatus, ReviewHistoryEntry, TraceabilityTimelineEvent } from '@/types'

/**
 * Session-local status/correction state for AI findings, mirroring
 * `traceability-store`'s `appendHistoryAndTimeline` pattern exactly — the
 * same shape of history + timeline entries, just scoped across every
 * return's findings instead of one return's field traces. Human decisions
 * here never silently overwrite the AI's original numbers: `correctedValue`
 * is tracked separately from `suggestedValue` so both remain visible.
 */

let historySeq = 0
function nextId() {
  historySeq += 1
  return `ai_session_${historySeq}`
}

function appendHistoryAndTimeline(
  finding: AIFinding,
  historyEntry: Omit<ReviewHistoryEntry, 'id'>,
  timelineEvent: Omit<TraceabilityTimelineEvent, 'id'>
): AIFinding {
  const id = nextId()
  return {
    ...finding,
    reviewHistory: [...finding.reviewHistory, { ...historyEntry, id: `${id}_history` }],
    timeline: [...finding.timeline, { ...timelineEvent, id: `${id}_timeline` }],
  }
}

interface AIReviewState {
  findings: AIFinding[]
  selectedFindingId: string | null

  selectFinding: (id: string | null) => void

  acceptSuggestion: (id: string, actorId: string) => void
  requestDocument: (id: string, actorId: string) => void
  markExpected: (id: string, actorId: string) => void
  dismissFinding: (id: string, actorId: string) => void
  rejectFinding: (id: string, actorId: string, note?: string) => void
  correctValue: (id: string, newValue: number, reason: string, actorId: string) => void
  markVerified: (id: string, actorId: string) => void
}

function setStatus(
  finding: AIFinding,
  status: AIFindingStatus,
  action: ReviewHistoryEntry['action'],
  actorId: string,
  note: string,
  timelineType: TraceabilityTimelineEvent['type'],
  timelineLabel: string
): AIFinding {
  const now = new Date().toISOString()
  return appendHistoryAndTimeline(
    { ...finding, status, reviewerId: actorId, reviewedAt: now },
    { actorId, action, note, timestamp: now },
    { type: timelineType, label: timelineLabel, description: note, timestamp: now }
  )
}

export const useAIReviewStore = create<AIReviewState>()((set) => ({
  findings: aiFindings,
  selectedFindingId: null,

  selectFinding: (id) => set({ selectedFindingId: id }),

  acceptSuggestion: (id, actorId) =>
    set((state) => ({
      findings: state.findings.map((f) =>
        f.id !== id
          ? f
          : setStatus(
              { ...f, correctedValue: f.suggestedValue ?? f.currentValue },
              'human_verified',
              'approved',
              actorId,
              'Accepted the AI-suggested value.',
              'approved',
              'CPA accepted suggestion'
            )
      ),
    })),

  requestDocument: (id, actorId) =>
    set((state) => ({
      findings: state.findings.map((f) =>
        f.id !== id
          ? f
          : setStatus(f, 'needs_review', 'commented', actorId, 'Requested a supporting document from the client.', 'review_started', 'Document requested')
      ),
    })),

  markExpected: (id, actorId) =>
    set((state) => ({
      findings: state.findings.map((f) =>
        f.id !== id
          ? f
          : setStatus(f, 'human_verified', 'approved', actorId, 'Confirmed this is expected — not an error.', 'approved', 'CPA marked as expected')
      ),
    })),

  dismissFinding: (id, actorId) =>
    set((state) => ({
      findings: state.findings.map((f) =>
        f.id !== id
          ? f
          : setStatus(f, 'dismissed', 'commented', actorId, 'Dismissed — not relevant to this return.', 'review_started', 'Finding dismissed')
      ),
    })),

  rejectFinding: (id, actorId, note) =>
    set((state) => ({
      findings: state.findings.map((f) =>
        f.id !== id
          ? f
          : setStatus(f, 'rejected', 'rejected', actorId, note ?? 'Rejected — the AI finding does not apply.', 'rejected', 'CPA rejected finding')
      ),
    })),

  correctValue: (id, newValue, reason, actorId) =>
    set((state) => ({
      findings: state.findings.map((f) => {
        if (f.id !== id) return f
        const now = new Date().toISOString()
        return appendHistoryAndTimeline(
          {
            ...f,
            correctedValue: newValue,
            correctionReason: reason,
            status: 'human_corrected',
            reviewerId: actorId,
            reviewedAt: now,
          },
          { actorId, action: 'edited', note: reason, timestamp: now, previousValue: f.suggestedValue, newValue },
          { type: 'edited', label: 'CPA corrected value', description: reason, timestamp: now }
        )
      }),
    })),

  markVerified: (id, actorId) =>
    set((state) => ({
      findings: state.findings.map((f) =>
        f.id !== id
          ? f
          : setStatus(f, 'human_verified', 'approved', actorId, 'Marked verified after correction.', 'approved', 'CPA marked verified')
      ),
    })),
}))
