import { useNavigate } from '@tanstack/react-router'
import { CheckSquare, FileStack, FileText, MessagesSquare, Sparkles, Users } from 'lucide-react'
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
import { useNavigationStore } from '@/store/navigation-store'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { resolveWorkspaceHref } from '@/lib/object-graph'
import { taxReturns } from '@/mock/returns'
import { documents } from '@/mock/documents'
import { tasks } from '@/mock/tasks'
import { conversations } from '@/mock/conversations'
import { clients, getClientById } from '@/mock/clients'
import type { WorkspaceObjectType } from '@/types'

/** Global Cmd/Ctrl+K palette — jump to any page, related object, or trigger
 * a quick action. Selecting an object result starts a fresh navigation
 * trail, since search is an entry point rather than a contextual link. */
export function CommandPalette() {
  const navigate = useNavigate()
  const open = useUIStore((s) => s.commandPaletteOpen)
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const resetTrail = useNavigationStore((s) => s.resetTrail)

  useKeyboardShortcut({ key: 'k', onTrigger: () => setOpen(!open) })

  function go(href: string) {
    setOpen(false)
    void navigate({ to: href })
  }

  function goToObject(type: WorkspaceObjectType, id: string) {
    setOpen(false)
    resetTrail()
    void navigate({ to: resolveWorkspaceHref(type, id) })
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
      description="Search pages, returns, documents, tasks, messages, and clients across Ledgerly"
    >
      <CommandInput placeholder="Search pages, clients, returns, documents, tasks…" />
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

        <CommandGroup heading="Returns">
          {taxReturns.map((r) => {
            const client = getClientById(r.clientId)
            return (
              <CommandItem
                key={r.id}
                value={`${client?.name ?? ''} ${r.taxYear} ${r.formType} return`}
                onSelect={() => goToObject('return', r.id)}
              >
                <FileStack className="text-foreground-tertiary size-4" aria-hidden="true" />
                {client?.name} — {r.taxYear} {r.formType}
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Documents">
          {documents.map((doc) => (
            <CommandItem key={doc.id} value={`${doc.name} document`} onSelect={() => goToObject('document', doc.id)}>
              <FileText className="text-foreground-tertiary size-4" aria-hidden="true" />
              {doc.name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Tasks">
          {tasks.map((task) => (
            <CommandItem key={task.id} value={`${task.title} task`} onSelect={() => goToObject('task', task.id)}>
              <CheckSquare className="text-foreground-tertiary size-4" aria-hidden="true" />
              {task.title}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Messages">
          {conversations.map((conversation) => {
            const client = getClientById(conversation.clientId)
            return (
              <CommandItem
                key={conversation.id}
                value={`${conversation.title} ${client?.name ?? ''} conversation message`}
                onSelect={() => goToObject('conversation', conversation.id)}
              >
                <MessagesSquare className="text-foreground-tertiary size-4" aria-hidden="true" />
                {conversation.title} — {client?.name}
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Clients">
          {clients.map((client) => (
            <CommandItem
              key={client.id}
              value={`${client.name} client`}
              onSelect={() => goToObject('client', client.id)}
            >
              <Users className="text-foreground-tertiary size-4" aria-hidden="true" />
              {client.name}
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
