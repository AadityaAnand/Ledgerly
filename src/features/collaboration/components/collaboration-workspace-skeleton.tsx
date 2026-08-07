import { Skeleton } from '@/components/ui/skeleton'

/** Mirrors the messages workspace's actual 3-pane shape while data loads,
 * so the loading state doesn't jump to a completely different layout once
 * conversations arrive. */
export function CollaborationWorkspaceSkeleton() {
  return (
    <div className="flex h-full min-h-0">
      <div className="border-border flex w-[26%] min-w-0 flex-col border-r">
        <div className="border-border flex shrink-0 items-center gap-2 border-b p-3">
          <Skeleton className="h-8 flex-1 rounded-md" />
          <Skeleton className="h-8 w-16 shrink-0 rounded-md" />
        </div>
        <div className="border-border-subtle flex items-center justify-between border-b px-4 py-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-6" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-border-subtle flex items-start gap-3 border-b px-4 py-3">
            <Skeleton className="size-7 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-2.5 w-1/2" />
              <Skeleton className="h-2.5 w-2/3" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-[48%] min-w-0 flex-col">
        <div className="border-border flex shrink-0 items-center justify-between border-b px-4 py-3.5">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="size-7 rounded-full" />
        </div>
        <div className="flex flex-1 flex-col justify-end gap-3 p-4">
          <Skeleton className="ml-auto h-12 w-2/3 rounded-lg" />
          <Skeleton className="h-16 w-3/4 rounded-lg" />
          <Skeleton className="ml-auto h-10 w-1/2 rounded-lg" />
        </div>
        <div className="border-border border-t p-3">
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>

      <div className="flex w-[26%] min-w-0 flex-col">
        <div className="border-border border-b px-4 py-3.5">
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex flex-col gap-4 p-4">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
