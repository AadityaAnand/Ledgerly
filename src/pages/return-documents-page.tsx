import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { FileQuestion, FileText, Search, X } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { AIBadge } from '@/components/shared/ai-badge'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { DataGrid } from '@/components/shared/data-grid'
import { ReturnWorkspaceNav } from '@/features/return-workspace/components/return-workspace-nav'
import { getReturnIssues, getReturnAIFindings } from '@/features/return-workspace/lib/return-workspace-data'
import { getClientById } from '@/mock/clients'
import { getReturnById } from '@/mock/returns'
import { getDocumentsByReturnId } from '@/mock/documents'
import { useNavigationStore } from '@/store/navigation-store'
import { documentStatusMeta } from '@/utils/status'
import { formatFileSize, formatRelativeTime } from '@/utils/format'
import { cn } from '@/lib/utils'
import type { Document, DocumentCategory, DocumentStatus } from '@/types'
import type { LegacyColumnDef } from '@tanstack/react-table/legacy'

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  w2: 'W-2',
  '1099': '1099',
  k1: 'K-1',
  receipt: 'Receipt',
  prior_return: 'Prior return',
  bank_statement: 'Bank statement',
  other: 'Other',
}

const STATUS_FILTERS: (DocumentStatus | 'all')[] = ['all', 'uploaded', 'processing', 'verified', 'flagged']

const columns: LegacyColumnDef<Document, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Document',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileText className="text-foreground-tertiary size-4 shrink-0" aria-hidden="true" />
        <span className="text-foreground truncate font-medium">{row.original.name}</span>
        {row.original.aiExtracted && <AIBadge label="Extracted" />}
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Type',
    cell: ({ getValue }) => <span className="text-foreground-secondary">{CATEGORY_LABELS[getValue<DocumentCategory>()]}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge {...documentStatusMeta[getValue<Document['status']>()]} />,
  },
  {
    accessorKey: 'pageCount',
    header: 'Pages',
    cell: ({ getValue }) => <span className="text-foreground-tertiary tabular-nums">{getValue<number | undefined>() ?? '—'}</span>,
  },
  {
    accessorKey: 'fileSize',
    header: 'Size',
    cell: ({ getValue }) => <span className="text-foreground-tertiary tabular-nums">{formatFileSize(getValue<number>())}</span>,
  },
  {
    accessorKey: 'uploadedAt',
    header: 'Uploaded',
    cell: ({ getValue }) => <span className="text-foreground-tertiary tabular-nums">{formatRelativeTime(getValue<string>())}</span>,
  },
]

/** A document explorer scoped to one return — search, type/status filters,
 * and pagination via the shared `DataGrid` so 200+ documents stay
 * responsive without a custom virtualization layer. */
export function ReturnDocumentsPage() {
  const { returnId } = useParams({ strict: false }) as { returnId?: string }
  const navigate = useNavigate()
  const taxReturn = returnId ? getReturnById(returnId) : undefined
  const client = taxReturn ? getClientById(taxReturn.clientId) : undefined
  const visit = useNavigationStore((s) => s.visit)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | 'all'>('all')

  useEffect(() => {
    if (!client || !taxReturn) return
    visit(
      { type: 'return', id: taxReturn.id, label: `${client.name} — Documents`, href: `/returns/${taxReturn.id}/documents` },
      { returnId: taxReturn.id, clientId: client.id, status: taxReturn.status }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxReturn?.id, client?.id])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allDocuments = useMemo(() => (taxReturn ? getDocumentsByReturnId(taxReturn.id) : []), [taxReturn?.id])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allDocuments
      .filter((d) => (statusFilter === 'all' ? true : d.status === statusFilter))
      .filter((d) => (categoryFilter === 'all' ? true : d.category === categoryFilter))
      .filter((d) => (q ? d.name.toLowerCase().includes(q) : true))
      .sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1))
  }, [allDocuments, search, statusFilter, categoryFilter])

  if (!taxReturn || !client) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <EmptyState icon={FileQuestion} title="Return not found" description="This return doesn’t exist in this preview build." />
      </div>
    )
  }

  const categories = Array.from(new Set(allDocuments.map((d) => d.category))) as DocumentCategory[]
  const hasActiveFilters = search.trim() !== '' || statusFilter !== 'all' || categoryFilter !== 'all'

  return (
    <div className="flex h-full flex-col">
      <ReturnWorkspaceNav
        returnId={taxReturn.id}
        issuesCount={getReturnIssues(taxReturn.id).length}
        aiFindingsCount={getReturnAIFindings(taxReturn.id).length}
      />
      <ScrollArea className="min-h-0 flex-1">
        <PageContainer>
          <PageHeader
            title="Documents"
            description={`${allDocuments.length} documents on file for ${client.name}'s ${taxReturn.taxYear} return.`}
          />

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64">
              <Search className="text-foreground-tertiary pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" aria-hidden="true" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents…"
                aria-label="Search documents"
                className="h-8 pl-8 text-sm"
              />
            </div>
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                aria-pressed={statusFilter === status}
                className={cn(
                  'h-8 rounded-full px-3 text-xs font-medium transition-colors',
                  statusFilter === status ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-surface-hover'
                )}
              >
                {status === 'all' ? 'All statuses' : documentStatusMeta[status].label}
              </button>
            ))}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as DocumentCategory | 'all')}
              aria-label="Filter by document type"
              className="border-border bg-background text-foreground h-8 rounded-full border px-3 text-xs font-medium"
            >
              <option value="all">All types</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setStatusFilter('all')
                  setCategoryFilter('all')
                }}
                className="text-foreground-tertiary hover:text-foreground flex h-8 items-center gap-1 rounded-full px-2 text-xs"
              >
                <X className="size-3" aria-hidden="true" />
                Clear filters
              </button>
            )}
            <span className="text-foreground-tertiary ml-auto text-xs tabular-nums">
              {filtered.length} of {allDocuments.length}
            </span>
          </div>

          <DataGrid
            columns={columns}
            data={filtered}
            pageSize={20}
            emptyTitle="No documents match these filters"
            emptyDescription="Try a different search term or clear the filters above."
            onRowClick={(doc) => void navigate({ to: `/workspace/document/${doc.id}` })}
          />
        </PageContainer>
      </ScrollArea>
    </div>
  )
}
