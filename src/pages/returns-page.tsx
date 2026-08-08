import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { FileStack, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { ReturnStatusSummaryCard } from '@/features/return-status/components/return-status-summary-card'
import { ReturnStatusPanel } from '@/features/return-status/components/return-status-panel'
import { staggerContainer } from '@/lib/animations'
import { taxReturns, getReturnById } from '@/mock/returns'
import { getClientById } from '@/mock/clients'
import { tasks } from '@/mock/tasks'
import { useActiveRole, useActiveRoleUser } from '@/hooks/use-role'

export function ReturnsPage() {
  const navigate = useNavigate()
  const role = useActiveRole()
  const currentUser = useActiveRoleUser()
  const [selectedReturnId, setSelectedReturnId] = useState<string | null>(null)

  const returns = useMemo(() => {
    if (role !== 'SEASONAL_STAFF') return taxReturns
    const assignedReturnIds = new Set(
      tasks.filter((t) => t.assigneeId === currentUser.id && t.returnId).map((t) => t.returnId)
    )
    return taxReturns.filter((r) => assignedReturnIds.has(r.id))
  }, [role, currentUser.id])

  const selectedReturn = selectedReturnId ? getReturnById(selectedReturnId) : undefined
  const isStaffRole = role !== 'CLIENT' && role !== 'BUSINESS_OWNER'

  return (
    <PageContainer>
      <PageHeader
        title={role === 'SEASONAL_STAFF' ? 'Assigned Returns' : 'Returns'}
        description={
          role === 'SEASONAL_STAFF'
            ? 'Returns linked to the tasks assigned to you.'
            : 'Track every return from kickoff through filing — where it stands, what happens next, and who owns it.'
        }
        actions={
          role !== 'SEASONAL_STAFF' ? (
            <Button size="sm" className="gap-1.5" onClick={() => toast('Return creation isn’t wired up yet.')}>
              <Plus className="size-4" aria-hidden="true" />
              New return
            </Button>
          ) : undefined
        }
      />

      {returns.length === 0 ? (
        <EmptyState
          icon={FileStack}
          title={role === 'SEASONAL_STAFF' ? 'No returns assigned yet' : 'No returns yet'}
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {returns.map((r) => (
            <ReturnStatusSummaryCard key={r.id} taxReturn={r} onOpen={() => setSelectedReturnId(r.id)} />
          ))}
        </motion.div>
      )}

      <Sheet open={Boolean(selectedReturn)} onOpenChange={(open) => !open && setSelectedReturnId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selectedReturn && (
            <>
              <SheetHeader className="border-border border-b">
                <SheetTitle>{getClientById(selectedReturn.clientId)?.name}</SheetTitle>
                <SheetDescription>
                  {selectedReturn.taxYear} · Form {selectedReturn.formType}
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 px-4">
                <ReturnStatusPanel taxReturn={selectedReturn} />
              </div>
              {isStaffRole && (
                <SheetFooter className="border-border border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      void navigate({ to: '/returns/$returnId', params: { returnId: selectedReturn.id } })
                    }
                  >
                    Open full workspace
                  </Button>
                </SheetFooter>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </PageContainer>
  )
}
