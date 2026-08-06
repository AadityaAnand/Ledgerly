import { useMemo } from 'react'
import { useTheme } from 'next-themes'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url'
import { cn } from '@/lib/utils'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

interface PDFViewerContainerProps {
  fileUrl: string
  className?: string
}

/** Chrome + viewer for previewing a PDF document (a client-uploaded W-2,
 * 1099, or prior-year return). The worker script is bundled locally rather
 * than pulled from a CDN, so previews work offline. */
export function PDFViewerContainer({ fileUrl, className }: PDFViewerContainerProps) {
  const { resolvedTheme } = useTheme()
  const defaultLayoutPluginInstance = useMemo(() => defaultLayoutPlugin(), [])

  return (
    <div className={cn('bg-surface border-border overflow-hidden rounded-xl border', className)}>
      <Worker workerUrl={workerUrl}>
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
          theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        />
      </Worker>
    </div>
  )
}
