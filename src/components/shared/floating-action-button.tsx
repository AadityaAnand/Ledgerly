import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { transitions } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface FloatingActionButtonProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
  className?: string
}

export function FloatingActionButton({ icon: Icon, label, onClick, className }: FloatingActionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={transitions.slow}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'bg-primary text-primary-foreground fixed right-6 bottom-6 z-40 flex size-14 items-center justify-center rounded-full shadow-lg',
        className
      )}
    >
      <Icon className="size-6" aria-hidden="true" />
    </motion.button>
  )
}
