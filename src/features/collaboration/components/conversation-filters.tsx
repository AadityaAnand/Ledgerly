import { useMemo } from 'react'
import { ListFilter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { SearchBar } from '@/components/shared/search-bar'
import { FilterBar, type ActiveFilter } from '@/components/shared/filter-bar'
import { useCollaborationStore } from '@/store/collaboration-store'
import { clients } from '@/mock/clients'
import { getUserById, users } from '@/mock/users'
import { getDocumentById } from '@/mock/documents'
import { conversationCategoryMeta } from '@/utils/status'
import type { Conversation } from '@/types'

const ALL = 'all'

interface ConversationFiltersProps {
  conversations: Conversation[]
}

export function ConversationFilters({ conversations }: ConversationFiltersProps) {
  const filters = useCollaborationStore((s) => s.filters)
  const setFilter = useCollaborationStore((s) => s.setFilter)
  const clearFilters = useCollaborationStore((s) => s.clearFilters)

  const relevantClientIds = useMemo(() => [...new Set(conversations.map((c) => c.clientId))], [conversations])
  const relevantOwnerIds = useMemo(() => [...new Set(conversations.map((c) => c.ownerId))], [conversations])
  const relevantDocumentIds = useMemo(
    () => [...new Set(conversations.flatMap((c) => c.relatedDocumentIds ?? []))],
    [conversations]
  )

  const activeCount = [
    filters.clientId,
    filters.ownerId,
    filters.category,
    filters.documentId,
    filters.unreadOnly || null,
  ].filter(Boolean).length

  const activeFilterChips: ActiveFilter[] = []
  if (filters.category) {
    activeFilterChips.push({
      id: 'category',
      label: conversationCategoryMeta[filters.category].label,
      onRemove: () => setFilter('category', null),
    })
  }
  if (filters.clientId) {
    const client = clients.find((c) => c.id === filters.clientId)
    activeFilterChips.push({
      id: 'client',
      label: client?.name ?? 'Client',
      onRemove: () => setFilter('clientId', null),
    })
  }
  if (filters.ownerId) {
    const owner = getUserById(filters.ownerId)
    activeFilterChips.push({
      id: 'owner',
      label: `Owner: ${owner?.name ?? 'Unknown'}`,
      onRemove: () => setFilter('ownerId', null),
    })
  }
  if (filters.documentId) {
    const doc = getDocumentById(filters.documentId)
    activeFilterChips.push({
      id: 'document',
      label: doc?.name ?? 'Document',
      onRemove: () => setFilter('documentId', null),
    })
  }
  if (filters.unreadOnly) {
    activeFilterChips.push({ id: 'unread', label: 'Unread only', onRemove: () => setFilter('unreadOnly', false) })
  }

  return (
    <FilterBar activeFilters={activeFilterChips} onClearAll={activeFilterChips.length > 0 ? clearFilters : undefined}>
      <SearchBar
        value={filters.search}
        onChange={(value) => setFilter('search', value)}
        placeholder="Search conversations…"
        className="min-w-0 flex-1"
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
            <ListFilter className="size-3.5" aria-hidden="true" />
            Filters
            {activeCount > 0 && (
              <span className="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full text-[10px] font-semibold">
                {activeCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="flex w-64 flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-foreground-tertiary text-xs">Status</Label>
            <Select
              value={filters.category ?? ALL}
              onValueChange={(v) => setFilter('category', v === ALL ? null : (v as Conversation['category']))}
            >
              <SelectTrigger size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All statuses</SelectItem>
                {Object.entries(conversationCategoryMeta).map(([value, meta]) => (
                  <SelectItem key={value} value={value}>
                    {meta.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-foreground-tertiary text-xs">Client</Label>
            <Select value={filters.clientId ?? ALL} onValueChange={(v) => setFilter('clientId', v === ALL ? null : v)}>
              <SelectTrigger size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All clients</SelectItem>
                {relevantClientIds.map((id) => {
                  const client = clients.find((c) => c.id === id)
                  return client ? (
                    <SelectItem key={id} value={id}>
                      {client.name}
                    </SelectItem>
                  ) : null
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-foreground-tertiary text-xs">Owner</Label>
            <Select value={filters.ownerId ?? ALL} onValueChange={(v) => setFilter('ownerId', v === ALL ? null : v)}>
              <SelectTrigger size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Anyone</SelectItem>
                {relevantOwnerIds.map((id) => {
                  const owner = users.find((u) => u.id === id)
                  return owner ? (
                    <SelectItem key={id} value={id}>
                      {owner.name}
                    </SelectItem>
                  ) : null
                })}
              </SelectContent>
            </Select>
          </div>

          {relevantDocumentIds.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-foreground-tertiary text-xs">Document</Label>
              <Select
                value={filters.documentId ?? ALL}
                onValueChange={(v) => setFilter('documentId', v === ALL ? null : v)}
              >
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Any document</SelectItem>
                  {relevantDocumentIds.map((id) => {
                    const doc = getDocumentById(id)
                    return doc ? (
                      <SelectItem key={id} value={id}>
                        {doc.name}
                      </SelectItem>
                    ) : null
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          <label htmlFor="filter-unread-only" className="flex items-center gap-2 pt-1 text-sm">
            <Checkbox
              id="filter-unread-only"
              checked={filters.unreadOnly}
              onCheckedChange={(checked) => setFilter('unreadOnly', checked === true)}
            />
            Unread only
          </label>
        </PopoverContent>
      </Popover>
    </FilterBar>
  )
}
