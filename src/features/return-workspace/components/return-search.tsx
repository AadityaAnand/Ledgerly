import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { CheckSquare, FileStack, FileText, Search } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { getTracesByReturnId } from '@/mock/field-traces'
import { getDocumentsByReturnId } from '@/mock/documents'
import { getTasksByReturnId } from '@/mock/tasks'
import { traceCategoryLabels, verificationStatusMeta, documentCategoryLabels, documentStatusMeta, taskStatusMeta } from '@/utils/status'
import { useDebouncedValue } from '@/hooks/use-debounced-value'

interface ReturnSearchProps {
  returnId: string
}

/** Search scoped to a single return — fields, documents, and tasks — rather
 * than the global Cmd+K palette. At hundreds of items per return, a
 * return-scoped search stays fast and every result is already in context
 * (same client, same return), so selecting one is a direct deep link. */
export function ReturnSearch({ returnId }: ReturnSearchProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 150)

  const traces = useMemo(() => getTracesByReturnId(returnId), [returnId])
  const documents = useMemo(() => getDocumentsByReturnId(returnId), [returnId])
  const tasks = useMemo(() => getTasksByReturnId(returnId), [returnId])

  const q = debouncedQuery.trim().toLowerCase()
  const matchedTraces = q ? traces.filter((t) => t.label.toLowerCase().includes(q) || t.formLine.toLowerCase().includes(q)).slice(0, 8) : []
  const matchedDocuments = q ? documents.filter((d) => d.name.toLowerCase().includes(q) || d.category.includes(q)).slice(0, 8) : []
  const matchedTasks = q ? tasks.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 8) : []
  const hasResults = matchedTraces.length + matchedDocuments.length + matchedTasks.length > 0

  function go(href: string) {
    setOpen(false)
    setQuery('')
    void navigate({ to: href })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="border-border bg-background text-foreground-tertiary hover:bg-surface-hover flex h-7.5 w-56 items-center gap-2 rounded-md border px-2.5 text-xs transition-colors"
        >
          <Search className="size-3.5" aria-hidden="true" />
          <span className="flex-1 text-left">Search this return…</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search fields, documents, tasks…"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {q.length > 0 && !hasResults && <CommandEmpty>No matches for “{query}” in this return.</CommandEmpty>}
            {q.length === 0 && (
              <p className="text-foreground-tertiary px-3 py-6 text-center text-xs">
                Search across this return's fields, documents, and tasks.
              </p>
            )}
            {matchedTraces.length > 0 && (
              <CommandGroup heading="Fields">
                {matchedTraces.map((t) => (
                  <CommandItem key={t.id} value={t.id} onSelect={() => go(`/returns/${returnId}?field=${t.id}`)}>
                    <FileStack className="text-foreground-tertiary size-4 shrink-0" aria-hidden="true" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate">{t.label}</span>
                      <span className="text-foreground-tertiary text-xs">
                        {traceCategoryLabels[t.category]} · {t.formLine} · {verificationStatusMeta[t.verification].label}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {matchedDocuments.length > 0 && (
              <CommandGroup heading="Documents">
                {matchedDocuments.map((d) => (
                  <CommandItem key={d.id} value={d.id} onSelect={() => go(`/workspace/document/${d.id}`)}>
                    <FileText className="text-foreground-tertiary size-4 shrink-0" aria-hidden="true" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate">{d.name}</span>
                      <span className="text-foreground-tertiary text-xs">
                        {documentCategoryLabels[d.category]} · {documentStatusMeta[d.status].label}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {matchedTasks.length > 0 && (
              <CommandGroup heading="Tasks">
                {matchedTasks.map((t) => (
                  <CommandItem key={t.id} value={t.id} onSelect={() => go(`/workspace/task/${t.id}`)}>
                    <CheckSquare className="text-foreground-tertiary size-4 shrink-0" aria-hidden="true" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate">{t.title}</span>
                      <span className="text-foreground-tertiary text-xs">{taskStatusMeta[t.status].label}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
