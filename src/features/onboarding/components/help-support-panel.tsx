import { LifeBuoy, MessageCircleQuestion, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

interface HelpSupportPanelProps {
  cpaName: string
}

export function HelpSupportPanel({ cpaName }: HelpSupportPanelProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="bg-primary-subtle text-primary-subtle-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
          <MessageCircleQuestion className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-foreground text-sm font-medium">Message {cpaName}</p>
          <p className="text-foreground-secondary mt-0.5 text-sm leading-relaxed">
            Have a question about a document or the process? Reach out directly.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            onClick={() => void navigate({ to: '/messages' })}
          >
            Send a message
          </Button>
        </div>
      </div>

      <div className="border-border-subtle flex items-start gap-3 border-t pt-3">
        <div className="bg-surface flex size-9 shrink-0 items-center justify-center rounded-lg">
          <LifeBuoy className="text-foreground-tertiary size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-foreground text-sm font-medium">Help center</p>
          <p className="text-foreground-secondary mt-0.5 text-sm leading-relaxed">
            Guides on uploading documents, e-signing, and what to expect next.
          </p>
          <Button
            size="sm"
            variant="ghost"
            className="mt-2 px-0 hover:bg-transparent"
            onClick={() => toast('Help center isn’t wired up in this preview build.')}
          >
            Browse articles
          </Button>
        </div>
      </div>

      <div className="border-border-subtle flex items-start gap-3 border-t pt-3">
        <div className="bg-surface flex size-9 shrink-0 items-center justify-center rounded-lg">
          <Phone className="text-foreground-tertiary size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-foreground text-sm font-medium">Call us</p>
          <p className="text-foreground-secondary mt-0.5 text-sm leading-relaxed">Mon–Fri, 9am–6pm ET</p>
        </div>
      </div>
    </div>
  )
}
