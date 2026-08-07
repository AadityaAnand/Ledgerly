import { motion } from 'framer-motion'
import { iconPressable, staggerContainer, staggerItem } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface DocumentThumbnailsProps {
  pageCount: number
  activePage: number
  onSelectPage: (page: number) => void
}

export function DocumentThumbnails({ pageCount, activePage, onSelectPage }: DocumentThumbnailsProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="border-border bg-surface flex w-16 shrink-0 flex-col items-center gap-2 overflow-y-auto border-r py-3"
    >
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
        <motion.button
          key={page}
          variants={staggerItem}
          {...iconPressable}
          type="button"
          onClick={() => onSelectPage(page)}
          aria-current={page === activePage ? 'page' : undefined}
          aria-label={`Page ${page}`}
          className={cn(
            'flex aspect-8.5/11 w-10 shrink-0 items-center justify-center rounded-sm border bg-white text-[10px] font-medium transition-[color,border-color,box-shadow] focus-visible:-outline-offset-2',
            page === activePage
              ? 'border-ai-500 text-ai-700 ring-ai-400/40 ring-2'
              : 'border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600'
          )}
        >
          {page}
        </motion.button>
      ))}
    </motion.div>
  )
}
