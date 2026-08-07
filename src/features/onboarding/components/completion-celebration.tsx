import { PartyPopper } from 'lucide-react'
import { motion } from 'framer-motion'
import { scaleIn, transitions } from '@/lib/animations'

/** Replaces the Next Action Card once every onboarding step is complete —
 * the "everything's done" empty state for the page's primary slot. */
export function CompletionCelebration() {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="border-success/25 bg-success-subtle/40 flex flex-col items-center gap-3 rounded-2xl border p-10 text-center"
    >
      <motion.div
        initial={{ scale: 0.6, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={transitions.spring}
        className="bg-success flex size-14 items-center justify-center rounded-full"
      >
        <PartyPopper className="size-6 text-white" aria-hidden="true" />
      </motion.div>
      <h2 className="text-foreground text-xl font-semibold tracking-tight">You're all set!</h2>
      <p className="text-foreground-secondary max-w-sm text-sm leading-relaxed">
        You've completed everything we need for now. Your CPA will reach out here if anything else comes up.
      </p>
    </motion.div>
  )
}
