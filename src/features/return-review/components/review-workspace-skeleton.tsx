import { Skeleton } from '@/components/ui/skeleton'

/** Mirrors the workspace's actual header + 3-pane shape while data loads,
 * rather than a generic list placeholder — so the loading state doesn't
 * jump to a completely different layout once content arrives. */
export function ReviewWorkspaceSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex shrink-0 items-center justify-between gap-4 border-b px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-md" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-52" />
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Skeleton className="h-1.5 w-28 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <div className="flex items-center -space-x-1.5">
            <Skeleton className="ring-background size-7 rounded-full ring-2" />
            <Skeleton className="ring-background size-7 rounded-full ring-2" />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="border-border flex w-[34%] min-w-0 flex-col border-r">
          <div className="border-border-subtle flex items-center justify-between border-b px-4 py-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-border-subtle flex items-center gap-3 border-b px-4 py-3">
              <Skeleton className="size-5 shrink-0 rounded-full" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
              <Skeleton className="h-3.5 w-14 shrink-0" />
              <Skeleton className="size-5 shrink-0 rounded-full" />
              <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
            </div>
          ))}
        </div>

        <div className="flex w-[40%] min-w-0 flex-col">
          <div className="border-border flex items-center justify-between border-b px-4 py-3.5">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
          <div className="flex flex-1 items-center justify-center p-8">
            <Skeleton className="aspect-8.5/11 w-full max-w-100" />
          </div>
        </div>

        <div className="flex w-[26%] min-w-0 flex-col">
          <div className="border-border border-b px-4 py-3.5">
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex flex-col gap-4 p-4">
            <div className="flex items-start justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="size-16 rounded-full" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-8 rounded-md" />
              <Skeleton className="h-8 rounded-md" />
              <Skeleton className="h-8 rounded-md" />
              <Skeleton className="h-8 rounded-md" />
            </div>
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
