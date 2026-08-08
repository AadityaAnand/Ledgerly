import { SlidersHorizontal } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/shared/search-bar'
import { FilterBar, type ActiveFilter } from '@/components/shared/filter-bar'
import { workItemCategoryMeta } from '@/features/dashboard/work-item-meta'
import { taskPriorityMeta } from '@/utils/status'
import type { User, WorkItemCategory, WorkItemFilters as WorkItemFiltersState } from '@/types'

const ALL = 'all'

const quickFilters: { label: string; apply: Partial<WorkItemFiltersState> }[] = [
  { label: 'All', apply: { category: null, priority: null, dueWithin: null } },
  { label: 'Urgent', apply: { priority: 'urgent', category: null, dueWithin: null } },
  { label: 'Due Today', apply: { dueWithin: 'today', category: null, priority: null } },
  { label: 'Blocked', apply: { category: 'blocked', priority: null, dueWithin: null } },
  { label: 'Waiting on Client', apply: { category: 'missing_document', priority: null, dueWithin: null } },
  { label: 'AI Review', apply: { category: 'ai_review', priority: null, dueWithin: null } },
  { label: 'CPA Review', apply: { category: 'cpa_review', priority: null, dueWithin: null } },
]

function isQuickFilterActive(filters: WorkItemFiltersState, apply: Partial<WorkItemFiltersState>) {
  return (
    (apply.category ?? null) === filters.category &&
    (apply.priority ?? null) === filters.priority &&
    (apply.dueWithin ?? null) === filters.dueWithin
  )
}

interface WorkItemFiltersProps {
  filters: WorkItemFiltersState
  onChange: <K extends keyof WorkItemFiltersState>(key: K, value: WorkItemFiltersState[K]) => void
  onApplyPreset: (preset: Partial<WorkItemFiltersState>) => void
  onClearAll: () => void
  owners: User[]
}

export function WorkItemFiltersBar({ filters, onChange, onApplyPreset, onClearAll, owners }: WorkItemFiltersProps) {
  const activeCount = [filters.category, filters.priority, filters.ownerId, filters.dueWithin].filter(Boolean).length

  const activeFilterChips: ActiveFilter[] = []
  if (filters.category) {
    activeFilterChips.push({
      id: 'category',
      label: workItemCategoryMeta[filters.category].label,
      onRemove: () => onChange('category', null),
    })
  }
  if (filters.priority) {
    activeFilterChips.push({
      id: 'priority',
      label: taskPriorityMeta[filters.priority].label,
      onRemove: () => onChange('priority', null),
    })
  }
  if (filters.ownerId) {
    const owner = owners.find((o) => o.id === filters.ownerId)
    activeFilterChips.push({
      id: 'owner',
      label: owner?.name ?? 'Owner',
      onRemove: () => onChange('ownerId', null),
    })
  }
  if (filters.dueWithin) {
    const label = filters.dueWithin === 'overdue' ? 'Overdue' : filters.dueWithin === 'today' ? 'Due today' : 'Due this week'
    activeFilterChips.push({ id: 'due', label, onRemove: () => onChange('dueWithin', null) })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {quickFilters.map((qf) => (
          <button
            key={qf.label}
            type="button"
            onClick={() => onApplyPreset(qf.apply)}
            aria-pressed={isQuickFilterActive(filters, qf.apply)}
            className={
              isQuickFilterActive(filters, qf.apply)
                ? 'bg-primary text-primary-foreground focus-visible:-outline-offset-2 flex h-7 shrink-0 items-center rounded-full px-3 text-xs font-medium transition-colors'
                : 'bg-surface text-foreground-secondary hover:bg-surface-hover focus-visible:-outline-offset-2 flex h-7 shrink-0 items-center rounded-full px-3 text-xs font-medium transition-colors'
            }
          >
            {qf.label}
          </button>
        ))}
      </div>

      <FilterBar activeFilters={activeFilterChips} onClearAll={activeCount > 0 ? onClearAll : undefined}>
        <SearchBar
          value={filters.search}
          onChange={(value) => onChange('search', value)}
          placeholder="Search work…"
          className="min-w-0 flex-1"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
              <SlidersHorizontal className="size-3.5" aria-hidden="true" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="flex w-64 flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-foreground-tertiary text-xs">Category</Label>
              <Select
                value={filters.category ?? ALL}
                onValueChange={(v) => onChange('category', v === ALL ? null : (v as WorkItemCategory))}
              >
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All categories</SelectItem>
                  {Object.entries(workItemCategoryMeta).map(([value, meta]) => (
                    <SelectItem key={value} value={value}>
                      {meta.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-foreground-tertiary text-xs">Priority</Label>
              <Select
                value={filters.priority ?? ALL}
                onValueChange={(v) => onChange('priority', v === ALL ? null : (v as WorkItemFiltersState['priority']))}
              >
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Any priority</SelectItem>
                  {Object.entries(taskPriorityMeta).map(([value, meta]) => (
                    <SelectItem key={value} value={value}>
                      {meta.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {owners.length > 1 && (
              <div className="flex flex-col gap-1.5">
                <Label className="text-foreground-tertiary text-xs">Owner</Label>
                <Select value={filters.ownerId ?? ALL} onValueChange={(v) => onChange('ownerId', v === ALL ? null : v)}>
                  <SelectTrigger size="sm" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Anyone</SelectItem>
                    {owners.map((owner) => (
                      <SelectItem key={owner.id} value={owner.id}>
                        {owner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label className="text-foreground-tertiary text-xs">Due</Label>
              <Select
                value={filters.dueWithin ?? ALL}
                onValueChange={(v) => onChange('dueWithin', v === ALL ? null : (v as WorkItemFiltersState['dueWithin']))}
              >
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Any time</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="today">Due today</SelectItem>
                  <SelectItem value="week">Due this week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
      </FilterBar>
    </div>
  )
}
