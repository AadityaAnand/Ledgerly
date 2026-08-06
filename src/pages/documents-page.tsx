import { FolderOpen, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'

export function DocumentsPage() {
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
      <EmptyState
        icon={FolderOpen}
        title="This view is coming together"
        description="The document library — uploads, previews, and AI extraction — lands in the next build."
      />
    </PageContainer>
  )
}
