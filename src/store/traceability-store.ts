import { create } from 'zustand'
import { getFieldSlotById } from '@/mock'
import type { ReviewHistoryEntry, TaxFieldTrace, TraceabilityTimelineEvent } from '@/types'

const ZOOM_MIN = 0.5
const ZOOM_MAX = 2
const ZOOM_STEP = 0.25

let historySeq = 0
function nextHistoryId() {
  historySeq += 1
  return `rh_session_${historySeq}`
}

function appendHistoryAndTimeline(
  trace: TaxFieldTrace,
  historyEntry: Omit<ReviewHistoryEntry, 'id'>,
  timelineEvent: Omit<TraceabilityTimelineEvent, 'id'>
): TaxFieldTrace {
  const id = nextHistoryId()
  return {
    ...trace,
    reviewHistory: [...trace.reviewHistory, { ...historyEntry, id: `${id}_history` }],
    timeline: [...trace.timeline, { ...timelineEvent, id: `${id}_timeline` }],
  }
}

interface TraceabilityState {
  traces: TaxFieldTrace[]
  isLoading: boolean

  selectedFieldId: string | null
  hoveredFieldId: string | null
  /** The field whose document/highlight should currently be shown — hover previews
   * without committing the selection, falling back to the selected field. */
  activeFieldId: string | null

  zoomLevel: number
  activePageNumber: number

  initialize: (traces: TaxFieldTrace[]) => void
  setLoading: (loading: boolean) => void

  selectField: (id: string | null) => void
  hoverField: (id: string | null) => void

  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  setActivePage: (page: number) => void

  approveField: (id: string, actorId: string) => void
  rejectField: (id: string, actorId: string, note: string) => void
  flagForReview: (id: string, actorId: string, note: string) => void
  editValue: (id: string, newValue: number, actorId: string, note?: string) => void
  resetOverride: (id: string, actorId: string) => void
}

export const useTraceabilityStore = create<TraceabilityState>()((set, get) => ({
  traces: [],
  isLoading: true,

  selectedFieldId: null,
  hoveredFieldId: null,
  activeFieldId: null,

  zoomLevel: 1,
  activePageNumber: 1,

  initialize: (traces) => set({ traces, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),

  selectField: (id) => {
    const trace = id ? get().traces.find((t) => t.id === id) : undefined
    const slot = trace?.sourceFieldId ? getFieldSlotById(trace.sourceFieldId) : undefined
    set({
      selectedFieldId: id,
      hoveredFieldId: null,
      activeFieldId: id,
      activePageNumber: slot?.pageNumber ?? 1,
      zoomLevel: 1,
    })
  },

  hoverField: (id) => {
    set((state) => ({
      hoveredFieldId: id,
      activeFieldId: id ?? state.selectedFieldId,
    }))
  },

  zoomIn: () =>
    set((state) => ({ zoomLevel: Math.min(ZOOM_MAX, +(state.zoomLevel + ZOOM_STEP).toFixed(2)) })),
  zoomOut: () =>
    set((state) => ({ zoomLevel: Math.max(ZOOM_MIN, +(state.zoomLevel - ZOOM_STEP).toFixed(2)) })),
  resetZoom: () => set({ zoomLevel: 1 }),
  setActivePage: (page) => set({ activePageNumber: page }),

  approveField: (id, actorId) =>
    set((state) => ({
      traces: state.traces.map((trace) =>
        trace.id !== id
          ? trace
          : appendHistoryAndTimeline(
              {
                ...trace,
                verification: 'verified',
                reviewerId: actorId,
                reviewedAt: new Date().toISOString(),
              },
              { actorId, action: 'approved', timestamp: new Date().toISOString() },
              {
                type: 'approved',
                label: 'Approved by reviewer',
                description: 'Marked verified during this review session.',
                timestamp: new Date().toISOString(),
              }
            )
      ),
    })),

  rejectField: (id, actorId, note) =>
    set((state) => ({
      traces: state.traces.map((trace) =>
        trace.id !== id
          ? trace
          : appendHistoryAndTimeline(
              {
                ...trace,
                verification: 'rejected',
                reviewerId: actorId,
                reviewedAt: new Date().toISOString(),
              },
              { actorId, action: 'rejected', note, timestamp: new Date().toISOString() },
              {
                type: 'rejected',
                label: 'Rejected by reviewer',
                description: note,
                timestamp: new Date().toISOString(),
              }
            )
      ),
    })),

  flagForReview: (id, actorId, note) =>
    set((state) => ({
      traces: state.traces.map((trace) =>
        trace.id !== id
          ? trace
          : appendHistoryAndTimeline(
              {
                ...trace,
                verification: 'needs_review',
                reviewerId: actorId,
                reviewedAt: new Date().toISOString(),
              },
              { actorId, action: 'flagged', note, timestamp: new Date().toISOString() },
              {
                type: 'flagged',
                label: 'Flagged for review',
                description: note,
                timestamp: new Date().toISOString(),
              }
            )
      ),
    })),

  editValue: (id, newValue, actorId, note) =>
    set((state) => ({
      traces: state.traces.map((trace) => {
        if (trace.id !== id) return trace
        const previousValue = trace.value
        return appendHistoryAndTimeline(
          {
            ...trace,
            value: newValue,
            originalValue: trace.originalValue ?? previousValue,
            verification: 'overridden',
            reviewerId: actorId,
            reviewedAt: new Date().toISOString(),
          },
          { actorId, action: 'edited', note, timestamp: new Date().toISOString(), previousValue, newValue },
          {
            type: 'edited',
            label: 'Value corrected',
            description: note?.trim() ? note : `Manually changed from ${previousValue} to ${newValue}.`,
            timestamp: new Date().toISOString(),
          }
        )
      }),
    })),

  resetOverride: (id, actorId) =>
    set((state) => ({
      traces: state.traces.map((trace) => {
        if (trace.id !== id || trace.originalValue === undefined) return trace
        const restoredValue = trace.originalValue
        return appendHistoryAndTimeline(
          { ...trace, value: restoredValue, originalValue: undefined, verification: 'needs_review' },
          {
            actorId,
            action: 'reset',
            note: 'Reverted to the original AI-extracted value.',
            timestamp: new Date().toISOString(),
            previousValue: trace.value,
            newValue: restoredValue,
          },
          {
            type: 'edited',
            label: 'Override reverted',
            description: 'Restored the original AI-extracted value.',
            timestamp: new Date().toISOString(),
          }
        )
      }),
    })),
}))
