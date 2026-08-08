import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { IconButton } from '@/components/shared/icon-button'
import { StatusBadge } from '@/components/shared/status-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { returnStatusMeta } from '@/utils/status'
import { getUserById } from '@/mock/users'
import { useHasPermission } from '@/hooks/use-role'
import type { Client, TaxReturn } from '@/types'

interface ReviewWorkspaceHeaderProps {
  client: Client
  taxReturn: TaxReturn
}

export function ReviewWorkspaceHeader({ client, taxReturn }: ReviewWorkspaceHeaderProps) {
  const navigate = useNavigate()
  const preparer = getUserById(taxReturn.assignedPreparerId)
  const reviewer = taxReturn.assignedReviewerId ? getUserById(taxReturn.assignedReviewerId) : undefined
  const canApprove = useHasPermission('APPROVE_RETURN')

  return (
    <header className="border-border flex shrink-0 items-center justify-between gap-4 border-b px-5 py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <IconButton
          label="Back to Dashboard"
          icon={<ArrowLeft className="size-4" />}
          onClick={() => void navigate({ to: '/' })}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-foreground truncate text-sm font-semibold">{client.name}</h1>
            <span className="text-foreground-tertiary text-xs">·</span>
            <span className="text-foreground-secondary text-xs">{taxReturn.formType}</span>
            <span className="text-foreground-tertiary text-xs">·</span>
            <span className="text-foreground-secondary text-xs">Tax Year {taxReturn.taxYear}</span>
          </div>
          <p className="text-foreground-tertiary text-xs">Source document traceability review</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-5">
        <div className="hidden items-center gap-2 md:flex">
          <Progress value={taxReturn.progress} className="h-1.5 w-28" />
          <span className="text-foreground-tertiary text-xs tabular-nums">{taxReturn.progress}%</span>
        </div>
        <StatusBadge {...returnStatusMeta[taxReturn.status]} />
        <div className="flex items-center -space-x-1.5">
          {preparer && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ring-background inline-flex rounded-full ring-2">
                  <UserAvatar name={preparer.name} size="sm" />
                </span>
              </TooltipTrigger>
              <TooltipContent>Preparer — {preparer.name}</TooltipContent>
            </Tooltip>
          )}
          {reviewer && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ring-background inline-flex rounded-full ring-2">
                  <UserAvatar name={reviewer.name} size="sm" />
                </span>
              </TooltipTrigger>
              <TooltipContent>Reviewer — {reviewer.name}</TooltipContent>
            </Tooltip>
          )}
        </div>
        {canApprove && (
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() =>
              toast(`Approved — ${client.name}`, {
                description: 'This is a foundation build — this action isn’t wired up yet.',
              })
            }
          >
            Approve return
          </Button>
        )}
      </div>
    </header>
  )
}
