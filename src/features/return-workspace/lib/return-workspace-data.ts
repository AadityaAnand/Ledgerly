import { getTasksByReturnId } from '@/mock/tasks'
import { getTracesByReturnId } from '@/mock/field-traces'
import { getDocumentsByReturnId } from '@/mock/documents'
import { taskStatusMeta, taskPriorityMeta, traceCategoryLabels, verificationStatusMeta } from '@/utils/status'
import type { Task, TaxFieldTrace, TraceCategory } from '@/types'

export type IssueSeverity = 'critical' | 'warning' | 'info'

export interface ReturnIssue {
  id: string
  kind: 'field' | 'task'
  severity: IssueSeverity
  title: string
  description: string
  category?: TraceCategory
  ownerId?: string
  statusLabel: string
  nextAction: string
  href: string
  createdAt: string
}

const OPEN_TRACE_STATUSES = new Set(['flagged', 'needs_review', 'rejected'])

function fieldHref(returnId: string, trace: TaxFieldTrace): string {
  return `/returns/${returnId}?field=${trace.id}`
}

/** Field-level + task-level issues for a return, unified into one navigable list.
 * Deliberately reuses `TaxFieldTrace.verification` and `Task.status` rather than
 * inventing a parallel "Issue" entity — an issue here is just an existing record
 * that needs attention, viewed through a different lens. */
export function getReturnIssues(returnId: string): ReturnIssue[] {
  const traces = getTracesByReturnId(returnId)
  const tasks = getTasksByReturnId(returnId)

  const fieldIssues: ReturnIssue[] = traces
    .filter((t) => OPEN_TRACE_STATUSES.has(t.verification) || t.hasConflict)
    .map((t) => {
      const severity: IssueSeverity =
        t.verification === 'rejected' || t.hasConflict
          ? 'critical'
          : t.verification === 'flagged'
            ? 'warning'
            : 'info'
      const description = t.hasConflict
        ? (t.conflictNote ?? 'This value conflicts with another figure on the return.')
        : t.suggestedAction ?? `${verificationStatusMeta[t.verification].label} — needs a reviewer's attention.`
      return {
        id: `issue_field_${t.id}`,
        kind: 'field',
        severity,
        title: t.label,
        description,
        category: t.category,
        ownerId: t.reviewerId,
        statusLabel: verificationStatusMeta[t.verification].label,
        nextAction: t.hasConflict ? 'Resolve conflicting value' : 'Review and approve or correct',
        href: fieldHref(returnId, t),
        createdAt: t.reviewedAt ?? t.timeline[0]?.timestamp ?? new Date().toISOString(),
      }
    })

  const taskIssues: ReturnIssue[] = tasks
    .filter((t) => t.status !== 'done')
    .map((t) => ({
      id: `issue_task_${t.id}`,
      kind: 'task',
      severity: t.priority === 'urgent' || t.status === 'blocked' ? 'critical' : t.priority === 'high' ? 'warning' : 'info',
      title: t.title,
      description: t.description ?? `${taskPriorityMeta[t.priority].label} priority task assigned to the team.`,
      ownerId: t.assigneeId,
      statusLabel: taskStatusMeta[t.status].label,
      nextAction: t.status === 'blocked' ? 'Unblock this task' : 'Complete this task',
      href: `/workspace/task/${t.id}`,
      createdAt: t.createdAt,
    }))

  return [...fieldIssues, ...taskIssues].sort((a, b) => severityRank(a.severity) - severityRank(b.severity))
}

function severityRank(severity: IssueSeverity): number {
  return severity === 'critical' ? 0 : severity === 'warning' ? 1 : 2
}

export type AIFindingType = 'low_confidence' | 'conflict' | 'needs_review' | 'suggested_correction'

export interface AIFinding {
  id: string
  type: AIFindingType
  title: string
  description: string
  confidence: number
  category: TraceCategory
  href: string
}

const findingTypeMeta: Record<AIFindingType, { label: string; description: string }> = {
  low_confidence: { label: 'Low confidence', description: 'The AI extraction confidence fell below a safe threshold.' },
  conflict: { label: 'Possible mismatch', description: 'This value conflicts with another figure on the return.' },
  needs_review: { label: 'Needs review', description: 'Flagged by the AI pipeline for a human reviewer.' },
  suggested_correction: { label: 'Suggested correction', description: 'The AI has a suggested next step for this field.' },
}

/** AI findings are also derived, not stored — every finding traces back to a
 * concrete `TaxFieldTrace` property (confidence, conflict, verification, or
 * suggestedAction) so this view can never drift from the field data itself. */
export function getReturnAIFindings(returnId: string): AIFinding[] {
  const traces = getTracesByReturnId(returnId)
  const findings: AIFinding[] = []

  for (const t of traces) {
    if (t.confidence < 70) {
      findings.push({
        id: `finding_lowconf_${t.id}`,
        type: 'low_confidence',
        title: t.label,
        description: `${findingTypeMeta.low_confidence.description} (${t.confidence}%)`,
        confidence: t.confidence,
        category: t.category,
        href: fieldHref(returnId, t),
      })
    }
    if (t.hasConflict) {
      findings.push({
        id: `finding_conflict_${t.id}`,
        type: 'conflict',
        title: t.label,
        description: t.conflictNote ?? findingTypeMeta.conflict.description,
        confidence: t.confidence,
        category: t.category,
        href: fieldHref(returnId, t),
      })
    }
    if (t.suggestedAction) {
      findings.push({
        id: `finding_suggest_${t.id}`,
        type: 'suggested_correction',
        title: t.label,
        description: t.suggestedAction,
        confidence: t.confidence,
        category: t.category,
        href: fieldHref(returnId, t),
      })
    }
  }

  return findings
}

export interface CategoryBreakdown {
  category: TraceCategory
  label: string
  count: number
  openCount: number
  total: number
}

export interface ReturnWorkspaceStats {
  fieldsTotal: number
  fieldsOpen: number
  documentsTotal: number
  documentsNeedingAttention: number
  tasksOpen: number
  issuesCount: number
  aiFindingsCount: number
  categories: CategoryBreakdown[]
}

export function getReturnWorkspaceStats(returnId: string): ReturnWorkspaceStats {
  const traces = getTracesByReturnId(returnId)
  const documents = getDocumentsByReturnId(returnId)
  const tasks: Task[] = getTasksByReturnId(returnId)

  const byCategory = new Map<TraceCategory, TaxFieldTrace[]>()
  for (const t of traces) {
    const list = byCategory.get(t.category) ?? []
    list.push(t)
    byCategory.set(t.category, list)
  }

  const categories: CategoryBreakdown[] = Array.from(byCategory.entries()).map(([category, items]) => ({
    category,
    label: traceCategoryLabels[category],
    count: items.length,
    openCount: items.filter((t) => OPEN_TRACE_STATUSES.has(t.verification) || t.hasConflict).length,
    total: items.reduce((sum, t) => sum + t.value, 0),
  }))

  return {
    fieldsTotal: traces.length,
    fieldsOpen: traces.filter((t) => OPEN_TRACE_STATUSES.has(t.verification) || t.hasConflict).length,
    documentsTotal: documents.length,
    documentsNeedingAttention: documents.filter((d) => d.status === 'flagged' || d.status === 'processing').length,
    tasksOpen: tasks.filter((t) => t.status !== 'done').length,
    issuesCount: getReturnIssues(returnId).length,
    aiFindingsCount: getReturnAIFindings(returnId).length,
    categories,
  }
}
