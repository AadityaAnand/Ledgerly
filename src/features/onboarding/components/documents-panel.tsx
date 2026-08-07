import { AlertCircle, FileText, Loader2, UploadCloud } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/status-badge'
import { AIBadge } from '@/components/shared/ai-badge'
import { EmptyState } from '@/components/shared/empty-state'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { documentStatusMeta } from '@/utils/status'
import { formatDate, formatFileSize, formatRelativeTime } from '@/utils/format'
import type { Document, OnboardingStepId, RequiredDocument } from '@/types'

interface DocumentsPanelProps {
  uploadedDocuments: Document[]
  missingDocuments: RequiredDocument[]
  completingStepId: OnboardingStepId | null
  onUpload: (stepId: OnboardingStepId) => void
}

export function DocumentsPanel({
  uploadedDocuments,
  missingDocuments,
  completingStepId,
  onUpload,
}: DocumentsPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      {missingDocuments.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-foreground-tertiary text-xs font-semibold tracking-wide uppercase">Missing</p>
          <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-2">
            {missingDocuments.map((doc) => (
              <motion.li
                key={doc.id}
                variants={staggerItem}
                className="border-warning/30 bg-warning-subtle/40 flex items-center gap-3 rounded-lg border px-3 py-2.5"
              >
                <AlertCircle className="text-warning size-4 shrink-0" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground text-sm font-medium">{doc.label}</p>
                  <p className="text-foreground-tertiary text-xs">Needed by {formatDate(doc.dueDate)}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 gap-1.5"
                  disabled={completingStepId === doc.stepId}
                  onClick={() => onUpload(doc.stepId)}
                >
                  {completingStepId === doc.stepId ? (
                    <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <UploadCloud className="size-3.5" aria-hidden="true" />
                  )}
                  Upload
                </Button>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-foreground-tertiary text-xs font-semibold tracking-wide uppercase">Recently uploaded</p>
        {uploadedDocuments.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No documents uploaded yet"
            description="Once you upload your W-2 or 1099, they’ll show up here."
            className="py-10"
          />
        ) : (
          <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-2">
            {uploadedDocuments.map((doc) => (
              <motion.li
                key={doc.id}
                variants={staggerItem}
                className="border-border-subtle flex items-center gap-3 rounded-lg border px-3 py-2.5"
              >
                <FileText className="text-foreground-tertiary size-4 shrink-0" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm font-medium">{doc.name}</p>
                  <p className="text-foreground-tertiary text-xs">
                    {formatFileSize(doc.fileSize)} · Uploaded {formatRelativeTime(doc.uploadedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {doc.aiExtracted && <AIBadge label="Extracted" />}
                  <StatusBadge {...documentStatusMeta[doc.status]} />
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </div>
  )
}
