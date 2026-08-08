import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2, Pencil, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/shared/icon-button'
import { UserAvatar } from '@/components/shared/user-avatar'
import { AIIndicator } from './ai-indicator'
import { ConfidenceLabel } from './confidence-indicator'
import { VerificationBadge } from './verification-badge'
import { ApprovalBadge } from './approval-badge'
import { LockedIndicator } from './locked-indicator'
import { useHasPermission } from '@/hooks/use-role'
import { formatDate } from '@/utils/format'
import { cn } from '@/lib/utils'
import type {
  AIFieldDetail,
  ApprovalDetail,
  FieldState,
  LockedDetail,
  Permission,
  VerificationDetail,
} from '@/types'

type EditMode = 'idle' | 'editing' | 'saving' | 'saved' | 'error'

export interface SmartFieldProps {
  label: string
  value: string
  helperText?: string
  state: FieldState
  className?: string

  /** clickable — opens something elsewhere (a document, a return, a task). */
  onOpen?: () => void

  /** editable — inline edit, save, cancel. */
  editValue?: string
  onSave?: (value: string) => void | Promise<void>
  validate?: (value: string) => string | undefined
  inputType?: 'text' | 'number'

  /** ai_generated */
  ai?: AIFieldDetail
  onViewSource?: () => void
  onEditFromAI?: () => void
  onMarkVerified?: () => void

  /** verified */
  verification?: VerificationDetail

  /** needs_approval */
  approval?: ApprovalDetail
  onReview?: () => void

  /** locked — either passed explicitly, or derived automatically when
   * `requiredPermission` fails for the active role. */
  locked?: LockedDetail
  requiredPermission?: Permission
  deniedReason?: string
}

/** The one engine behind every field-affordance component. Renders a
 * consistent label/value/indicator anatomy and swaps interaction behavior
 * by `state` — inline editing for `editable`, a compact popover for
 * `ai_generated` / `verified` / `needs_approval` / `locked`, a direct
 * action for `clickable`, and nothing interactive for `read_only`. */
export function SmartField(props: SmartFieldProps) {
  const { label, value, helperText, className } = props
  const canAct = useHasPermission(props.requiredPermission ?? 'VIEW_RETURN')

  // Auto-downgrade to locked when the active role lacks the required
  // permission — centralizes role-gating instead of scattering checks.
  const effectiveState: FieldState =
    props.requiredPermission && !canAct && props.state !== 'read_only' ? 'locked' : props.state
  const effectiveLocked: LockedDetail =
    props.locked ??
    (props.requiredPermission && !canAct
      ? { reason: props.deniedReason ?? "You don't have permission to change this value." }
      : { reason: 'This value cannot be changed.' })

  if (effectiveState === 'editable') {
    return <EditableFieldBody {...props} />
  }

  if (effectiveState === 'clickable') {
    return (
      <button
        type="button"
        onClick={props.onOpen}
        className={cn(
          'group focus-visible:-outline-offset-2 flex w-full flex-col gap-1 rounded-lg px-3 py-2.5 text-left transition-colors',
          'hover:bg-surface-hover cursor-pointer',
          className
        )}
      >
        <FieldHeader label={label} />
        <p className="text-foreground group-hover:text-primary text-sm font-medium transition-colors">{value}</p>
        {helperText && <p className="text-foreground-tertiary text-xs">{helperText}</p>}
      </button>
    )
  }

  if (effectiveState === 'read_only') {
    return (
      <div className={cn('flex flex-col gap-1 rounded-lg px-3 py-2.5', className)}>
        <FieldHeader label={label} />
        <p className="text-foreground text-sm font-medium">{value}</p>
        {helperText && <p className="text-foreground-tertiary text-xs">{helperText}</p>}
      </div>
    )
  }

  // ai_generated / verified / needs_approval / locked — all share the
  // "click to expand a compact panel" interaction.
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'group hover:bg-surface-hover focus-visible:-outline-offset-2 flex w-full flex-col gap-1 rounded-lg px-3 py-2.5 text-left transition-colors',
            className
          )}
        >
          <FieldHeader label={label}>
            {effectiveState === 'ai_generated' && props.ai && <AIIndicator confidence={props.ai.confidence} />}
            {effectiveState === 'verified' && (
              <VerificationBadge reviewerName={props.verification?.reviewerName} />
            )}
            {effectiveState === 'needs_approval' && <ApprovalBadge />}
            {effectiveState === 'locked' && <LockedIndicator />}
          </FieldHeader>
          <p className="text-foreground text-sm font-medium">{value}</p>
          {helperText && <p className="text-foreground-tertiary text-xs">{helperText}</p>}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        {effectiveState === 'ai_generated' && props.ai && (
          <AIDetailPanel
            label={label}
            value={value}
            ai={props.ai}
            onViewSource={props.onViewSource}
            onEditFromAI={props.onEditFromAI}
            onMarkVerified={props.onMarkVerified}
          />
        )}
        {effectiveState === 'verified' && props.verification && (
          <VerifiedDetailPanel label={label} verification={props.verification} />
        )}
        {effectiveState === 'needs_approval' && props.approval && (
          <ApprovalDetailPanel approval={props.approval} onReview={props.onReview} />
        )}
        {effectiveState === 'locked' && <LockedDetailPanel label={label} locked={effectiveLocked} />}
      </PopoverContent>
    </Popover>
  )
}

function FieldHeader({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-foreground-tertiary text-xs">{label}</span>
      {children}
    </div>
  )
}

// ─────────────────────────── Editable ───────────────────────────

function EditableFieldBody(props: SmartFieldProps) {
  const { label, value, helperText, editValue, onSave, validate, inputType = 'text', className } = props
  const [mode, setMode] = useState<EditMode>('idle')
  const [draft, setDraft] = useState(editValue ?? value)
  const [error, setError] = useState<string | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (mode === 'editing') inputRef.current?.focus()
  }, [mode])

  useEffect(() => {
    if (mode !== 'saved') return
    const timer = setTimeout(() => setMode('idle'), 1400)
    return () => clearTimeout(timer)
  }, [mode])

  function startEditing() {
    setDraft(editValue ?? value)
    setError(undefined)
    setMode('editing')
  }

  function cancel() {
    setDraft(editValue ?? value)
    setError(undefined)
    setMode('idle')
  }

  async function commit() {
    const validationError = validate?.(draft)
    if (validationError) {
      setError(validationError)
      setMode('error')
      return
    }
    setMode('saving')
    try {
      await onSave?.(draft)
      setMode('saved')
    } catch {
      setError('Something went wrong — try again.')
      setMode('error')
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      void commit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancel()
    }
  }

  const isEditing = mode === 'editing' || mode === 'saving' || mode === 'error'

  return (
    <div className={cn('flex flex-col gap-1 rounded-lg px-3 py-2.5 transition-colors', !isEditing && 'hover:bg-surface-hover', className)}>
      <FieldHeader label={label}>
        {mode === 'saved' ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-success flex items-center gap-1 text-xs font-medium"
          >
            <Check className="size-3" aria-hidden="true" />
            Saved
          </motion.span>
        ) : (
          !isEditing && (
            <Pencil
              className="text-foreground-tertiary size-3.5 opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          )
        )}
      </FieldHeader>

      {isEditing ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Input
              ref={inputRef}
              type={inputType}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={mode === 'saving'}
              aria-invalid={mode === 'error'}
              aria-label={label}
              className="h-8 flex-1 text-sm"
            />
            <IconButton
              label="Save"
              icon={mode === 'saving' ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
              size="icon-sm"
              disabled={mode === 'saving'}
              onClick={() => void commit()}
            />
            <IconButton
              label="Cancel"
              icon={<X className="size-3.5" />}
              size="icon-sm"
              variant="ghost"
              disabled={mode === 'saving'}
              onClick={cancel}
            />
          </div>
          {mode === 'error' && error && <p className="text-danger text-xs">{error}</p>}
        </div>
      ) : (
        <button
          type="button"
          onClick={startEditing}
          className="focus-visible:-outline-offset-2 text-foreground -mx-1 rounded px-1 py-0.5 text-left text-sm font-medium"
        >
          {value}
        </button>
      )}
      {helperText && !isEditing && <p className="text-foreground-tertiary text-xs">{helperText}</p>}
    </div>
  )
}

// ─────────────────────────── Detail panels ───────────────────────────

function AIDetailPanel({
  value,
  ai,
  onViewSource,
  onEditFromAI,
  onMarkVerified,
}: {
  label: string
  value: string
  ai: AIFieldDetail
} & Pick<SmartFieldProps, 'onViewSource' | 'onEditFromAI' | 'onMarkVerified'>) {
  const canEdit = useHasPermission('EDIT_RETURN')
  const canReview = useHasPermission('REVIEW_AI')

  return (
    <div className="flex flex-col gap-3">
      <div>
        <AIIndicator />
        <p className="text-foreground mt-2 text-xl font-semibold tabular-nums">{value}</p>
        <ConfidenceLabel score={ai.confidence} className="mt-0.5" />
      </div>
      {ai.sourceLabel && (
        <div>
          <p className="text-foreground-tertiary text-[10px] font-semibold tracking-wide uppercase">Source</p>
          <p className="text-foreground-secondary text-xs">{ai.sourceLabel}</p>
        </div>
      )}
      {ai.reasoning && (
        <div>
          <p className="text-foreground-tertiary text-[10px] font-semibold tracking-wide uppercase">
            Why this value?
          </p>
          <p className="text-foreground-secondary text-xs leading-relaxed">{ai.reasoning}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {onViewSource && (
          <Button size="xs" variant="outline" onClick={onViewSource}>
            View Source
          </Button>
        )}
        {onEditFromAI && canEdit && (
          <Button size="xs" variant="outline" onClick={onEditFromAI}>
            Edit
          </Button>
        )}
        {onMarkVerified && canReview && (
          <Button size="xs" onClick={onMarkVerified}>
            Mark Verified
          </Button>
        )}
      </div>
    </div>
  )
}

function VerifiedDetailPanel({ label, verification }: { label: string; verification: VerificationDetail }) {
  return (
    <div className="flex flex-col gap-3">
      <VerificationBadge />
      <div className="flex items-center gap-2.5">
        <UserAvatar name={verification.reviewerName} avatarUrl={verification.reviewerAvatarUrl} size="sm" />
        <div className="min-w-0">
          <p className="text-foreground text-sm font-medium">{verification.reviewerName}</p>
          <p className="text-foreground-tertiary text-xs">
            {formatDate(verification.timestamp, { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
      </div>
      {verification.sourceLabel && (
        <div>
          <p className="text-foreground-tertiary text-[10px] font-semibold tracking-wide uppercase">Source</p>
          <p className="text-foreground-secondary text-xs">{verification.sourceLabel}</p>
        </div>
      )}
      {verification.history && verification.history.length > 0 && (
        <div>
          <p className="text-foreground-tertiary text-[10px] font-semibold tracking-wide uppercase">History</p>
          <ul className="mt-1.5 flex flex-col gap-1.5">
            {verification.history.map((entry, i) => (
              <li key={i} className="text-foreground-secondary text-xs leading-relaxed">
                <span className="text-foreground font-medium">{entry.actorName}</span> {entry.action} ·{' '}
                <span className="text-foreground-tertiary">{formatDate(entry.timestamp)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-foreground-tertiary text-xs">“{label}” — reviewed and confirmed accurate.</p>
    </div>
  )
}

function ApprovalDetailPanel({ approval, onReview }: { approval: ApprovalDetail; onReview?: () => void }) {
  const canApprove = useHasPermission('APPROVE_RETURN')
  return (
    <div className="flex flex-col gap-3">
      <ApprovalBadge />
      <p className="text-foreground-secondary text-xs leading-relaxed">{approval.reason}</p>
      {approval.confidence !== undefined && <ConfidenceLabel score={approval.confidence} />}
      {onReview && canApprove && (
        <Button size="sm" className="w-fit gap-1.5" onClick={onReview}>
          Review
        </Button>
      )}
    </div>
  )
}

function LockedDetailPanel({ label, locked }: { label: string; locked: LockedDetail }) {
  return (
    <div className="flex flex-col gap-2">
      <LockedIndicator />
      <p className="text-foreground-secondary text-xs leading-relaxed">{locked.reason}</p>
      {locked.unlockHint && <p className="text-foreground-tertiary text-xs leading-relaxed">{locked.unlockHint}</p>}
      <p className="text-foreground-tertiary text-[11px]">“{label}” is currently locked.</p>
    </div>
  )
}
