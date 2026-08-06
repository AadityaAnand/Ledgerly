import { Plus, Users } from 'lucide-react'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'

export function ClientsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Clients"
        description="Every individual and business you prepare returns for."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => toast('Adding a client isn’t wired up yet.')}>
            <Plus className="size-4" aria-hidden="true" />
            Add client
          </Button>
        }
      />
      <EmptyState
        icon={Users}
        title="This view is coming together"
        description="A full client directory with entity details and return history lands in the next build."
      />
    </PageContainer>
  )
}
