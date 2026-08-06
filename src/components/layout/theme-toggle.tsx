import { useTheme } from 'next-themes'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { IconButton } from '@/components/shared/icon-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const options = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  // next-themes resolves the theme in its own effect on mount, so
  // `resolvedTheme` is undefined for the first render — use that instead of
  // a separate mounted flag to avoid a redundant setState-in-effect.
  const ActiveIcon = resolvedTheme === 'dark' ? Moon : Sun

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton label="Toggle theme" showTooltip={false} icon={<ActiveIcon className="size-4" />} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {options.map((option) => (
          <DropdownMenuItem key={option.value} onSelect={() => setTheme(option.value)}>
            <option.icon className="size-4" aria-hidden="true" />
            {option.label}
            {resolvedTheme && theme === option.value && (
              <Check className="ml-auto size-3.5" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
