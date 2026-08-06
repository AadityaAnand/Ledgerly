import { useNavigate } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { navItems, quickActions } from '@/components/layout/nav-config'
import { useUIStore } from '@/store/ui-store'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'

/** Global Cmd/Ctrl+K palette — jump to any page or trigger a quick action. */
export function CommandPalette() {
  const navigate = useNavigate()
  const open = useUIStore((s) => s.commandPaletteOpen)
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen)

  useKeyboardShortcut({ key: 'k', onTrigger: () => setOpen(!open) })

  function go(href: string) {
    setOpen(false)
    void navigate({ to: href })
  }

  function runQuickAction(label: string) {
    setOpen(false)
    toast(label, { description: 'This is a foundation build — this action isn’t wired up yet.' })
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command palette"
      description="Search pages and actions across Ledgerly"
    >
      <CommandInput placeholder="Search pages, clients, actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navItems.map((item) => (
            <CommandItem key={item.href} value={item.label} onSelect={() => go(item.href)}>
              <item.icon className="text-foreground-tertiary size-4" aria-hidden="true" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick actions">
          {quickActions.map((action) => (
            <CommandItem
              key={action.label}
              value={action.label}
              onSelect={() => runQuickAction(action.label)}
            >
              <action.icon className="text-foreground-tertiary size-4" aria-hidden="true" />
              {action.label}
            </CommandItem>
          ))}
          <CommandItem value="Ask Ledgerly AI" onSelect={() => runQuickAction('Ask Ledgerly AI')}>
            <Sparkles className="text-ai size-4" aria-hidden="true" />
            Ask Ledgerly AI
            <CommandShortcut>⌘J</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
