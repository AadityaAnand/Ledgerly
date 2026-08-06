import { MessageSquare, SquarePen } from 'lucide-react'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'

export function MessagesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Messages"
        description="One thread per client — no more digging through email."
        actions={
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => toast('Composing a message isn’t wired up yet.')}
          >
            <SquarePen className="size-4" aria-hidden="true" />
            New message
          </Button>
        }
      />
      <EmptyState
        icon={MessageSquare}
        title="This view is coming together"
        description="Client messaging with threaded conversations lands in the next build."
      />
    </PageContainer>
  )
}
