import type { ComponentType } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, CircleUser, FileStack, FileText, ListChecks, User } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useNavigationStore } from '@/store/navigation-store'
import { getClientById } from '@/mock/clients'
import { getReturnById, getReturnsByClientId } from '@/mock/returns'
import { getDocumentById, getDocumentsByReturnId } from '@/mock/documents'
import { getTaskById } from '@/mock/tasks'
import { resolveWorkspaceHref } from '@/lib/object-graph'
import { transitions } from '@/lib/animations'
import { cn } from '@/lib/utils'

function humanize(status: string) {
  return status.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase())
}

interface ChipProps {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
  onClick?: () => void
}

function Chip({ icon: Icon, label, value, onClick }: ChipProps) {
  const content = (
    <>
      <Icon className="text-foreground-tertiary size-3.5 shrink-0" aria-hidden="true" />
      <span className="text-foreground-tertiary shrink-0">{label}</span>
      <span className="text-foreground max-w-40 truncate font-medium">{value}</span>
    </>
  )

  if (!onClick) {
    return (
      <span className="border-border-subtle bg-surface flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs">
        {content}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="border-border-subtle bg-surface hover:bg-surface-hover focus-visible:-outline-offset-2 flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs transition-colors"
    >
      {content}
    </button>
  )
}

export function ContextBar() {
  const navigate = useNavigate()
  const context = useNavigationStore((s) => s.context)

  const hasContext = Boolean(context.returnId || context.clientId || context.documentId || context.taskId)

  const client = context.clientId ? getClientById(context.clientId) : undefined
  const taxReturn = context.returnId ? getReturnById(context.returnId) : undefined
  const document = context.documentId ? getDocumentById(context.documentId) : undefined
  const task = context.taskId ? getTaskById(context.taskId) : undefined

  const siblingReturns = client ? getReturnsByClientId(client.id).filter((r) => r.id !== taxReturn?.id) : []
  const siblingDocuments = taxReturn
    ? getDocumentsByReturnId(taxReturn.id).filter((d) => d.id !== document?.id)
    : []

  function go(type: Parameters<typeof resolveWorkspaceHref>[0], id: string) {
    void navigate({ to: resolveWorkspaceHref(type, id) })
  }

  return (
    <AnimatePresence initial={false}>
      {hasContext && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={transitions.base}
          className="overflow-hidden"
        >
          <div className="border-border bg-surface/60 flex flex-wrap items-center gap-2 border-b px-6 py-2">
            {client && <Chip icon={User} label="Client" value={client.name} onClick={() => go('client', client.id)} />}

            {taxReturn && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="border-border-subtle bg-surface hover:bg-surface-hover focus-visible:-outline-offset-2 flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs transition-colors"
                  >
                    <FileStack className="text-foreground-tertiary size-3.5 shrink-0" aria-hidden="true" />
                    <span className="text-foreground-tertiary shrink-0">Return</span>
                    <span className="text-foreground max-w-40 truncate font-medium">
                      {taxReturn.taxYear} {taxReturn.formType}
                    </span>
                    {siblingReturns.length > 0 && (
                      <ChevronDown className="text-foreground-tertiary size-3 shrink-0" aria-hidden="true" />
                    )}
                  </button>
                </PopoverTrigger>
                {siblingReturns.length > 0 && (
                  <PopoverContent align="start" className="w-64 p-1.5">
                    <p className="text-foreground-tertiary px-2 py-1.5 text-[11px] font-semibold tracking-wide uppercase">
                      Switch return
                    </p>
                    {siblingReturns.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => go('return', r.id)}
                        className="hover:bg-surface-hover flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors"
                      >
                        <span className="text-foreground">
                          {r.taxYear} {r.formType}
                        </span>
                        <span className="text-foreground-tertiary text-xs">{humanize(r.status)}</span>
                      </button>
                    ))}
                  </PopoverContent>
                )}
              </Popover>
            )}

            {document && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="border-border-subtle bg-surface hover:bg-surface-hover focus-visible:-outline-offset-2 flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs transition-colors"
                  >
                    <FileText className="text-foreground-tertiary size-3.5 shrink-0" aria-hidden="true" />
                    <span className="text-foreground-tertiary shrink-0">Document</span>
                    <span className="text-foreground max-w-40 truncate font-medium">{document.name}</span>
                    {siblingDocuments.length > 0 && (
                      <ChevronDown className="text-foreground-tertiary size-3 shrink-0" aria-hidden="true" />
                    )}
                  </button>
                </PopoverTrigger>
                {siblingDocuments.length > 0 && (
                  <PopoverContent align="start" className="w-64 p-1.5">
                    <p className="text-foreground-tertiary px-2 py-1.5 text-[11px] font-semibold tracking-wide uppercase">
                      Switch document
                    </p>
                    {siblingDocuments.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => go('document', d.id)}
                        className="hover:bg-surface-hover flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm transition-colors"
                      >
                        <span className="text-foreground truncate">{d.name}</span>
                      </button>
                    ))}
                  </PopoverContent>
                )}
              </Popover>
            )}

            {task && <Chip icon={ListChecks} label="Task" value={task.title} onClick={() => go('task', task.id)} />}

            {context.status && (
              <span
                className={cn(
                  'border-border-subtle bg-surface flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs'
                )}
              >
                <CircleUser className="text-foreground-tertiary size-3.5 shrink-0" aria-hidden="true" />
                <span className="text-foreground-tertiary">Status</span>
                <span className="text-foreground font-medium">{humanize(context.status)}</span>
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
