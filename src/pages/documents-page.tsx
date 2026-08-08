import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { FileText, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { DataGrid } from '@/components/shared/data-grid'
import { StatusBadge } from '@/components/shared/status-badge'
import { AIBadge } from '@/components/shared/ai-badge'
import { Button } from '@/components/ui/button'
import { documents } from '@/mock/documents'
import { getClientById } from '@/mock/clients'
import { useNavigationStore } from '@/store/navigation-store'
import { documentStatusMeta } from '@/utils/status'
import { formatFileSize, formatRelativeTime } from '@/utils/format'
import type { Document } from '@/types'
import type { LegacyColumnDef } from '@tanstack/react-table/legacy'

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
    accessorKey: 'clientId',
    header: 'Client',
    cell: ({ getValue }) => {
      const client = getClientById(getValue<string>())
      return <span className="text-foreground-secondary">{client?.name}</span>
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ getValue }) => <span className="text-foreground-secondary uppercase">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge {...documentStatusMeta[getValue<Document['status']>()]} />,
  },
  {
    accessorKey: 'fileSize',
    header: 'Size',
    cell: ({ getValue }) => <span className="text-foreground-tertiary tabular-nums">{formatFileSize(getValue<number>())}</span>,
  },
  {
    accessorKey: 'uploadedAt',
    header: 'Uploaded',
    cell: ({ getValue }) => (
      <span className="text-foreground-tertiary tabular-nums">{formatRelativeTime(getValue<string>())}</span>
    ),
  },
]

export function DocumentsPage() {
  const navigate = useNavigate()
  const resetTrail = useNavigationStore((s) => s.resetTrail)

  const sorted = useMemo(
    () => [...documents].sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1)),
    []
  )

  return (
    <PageContainer>
      <PageHeader
        title="Documents"
        description="Every W-2, 1099, and statement your clients send — organized and AI-extracted."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => toast('Document upload isn’t wired up yet.')}>
            <Upload className="size-4" aria-hidden="true" />
            Upload
          </Button>
        }
      />
      <DataGrid
        columns={columns}
        data={sorted}
        pageSize={10}
        emptyTitle="No documents yet"
        onRowClick={(doc) => {
          resetTrail()
          void navigate({ to: '/workspace/$type/$id', params: { type: 'document', id: doc.id } })
        }}
      />
    </PageContainer>
  )
}
