import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

/** Standard search input with a leading icon and a clear button. Debounce
 * the value at the call site with `useDebouncedValue` if it drives a filter
 * over a large list. */
export function SearchBar({ value, onChange, placeholder = 'Search…', className }: SearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        className="text-foreground-tertiary pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        aria-hidden="true"
      />
      <Input
        type="search"
        role="searchbox"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
        aria-label={placeholder}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="text-foreground-tertiary hover:text-foreground-secondary absolute top-1/2 right-2.5 -translate-y-1/2 rounded-sm p-0.5"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
