import { FileSpreadsheet, FileText, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { formatFileSize } from '@/utils/format'
import type { MessageAttachment } from '@/types'

const attachmentIcon = {
  pdf: FileText,
  image: ImageIcon,
  csv: FileSpreadsheet,
} as const

interface AttachmentChipProps {
  attachment: MessageAttachment
}

export function AttachmentChip({ attachment }: AttachmentChipProps) {
  const Icon = attachmentIcon[attachment.fileType]

  return (
    <button
      type="button"
      onClick={() => toast('Attachment preview isn’t available yet.')}
      className="border-border-subtle bg-surface-raised hover:bg-surface-hover focus-visible:-outline-offset-2 flex max-w-64 items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors"
    >
      <span className="bg-primary-subtle text-primary-subtle-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="text-foreground block truncate text-xs font-medium">{attachment.name}</span>
        <span className="text-foreground-tertiary block text-[11px]">{formatFileSize(attachment.fileSize)}</span>
      </span>
    </button>
  )
}
