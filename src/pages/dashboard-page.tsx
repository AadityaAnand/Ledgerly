import { AnimatePresence, motion } from 'framer-motion'
import { fadeIn } from '@/lib/animations'
import { useActiveWorkspace } from '@/hooks/use-role'
import { GetStartedPage } from '@/pages/get-started-page'
import { PreparerDashboard } from '@/features/dashboard/preparer-dashboard'
import { ReviewerDashboard } from '@/features/dashboard/reviewer-dashboard'
import { AdminDashboard } from '@/features/dashboard/admin-dashboard'
import { SeasonalDashboard } from '@/features/dashboard/seasonal-dashboard'

/** The "/" route is the one page every role lands on — so it's the page
 * that actually proves navigation and content adapt to role, not just
 * labels. Same shell, same route, entirely different content per role. */
export function DashboardPage() {
  const workspace = useActiveWorkspace()

  return (
    <AnimatePresence mode="wait">
      <motion.div key={workspace.role} variants={fadeIn} initial="hidden" animate="visible" exit="exit">
        {(workspace.role === 'CLIENT' || workspace.role === 'BUSINESS_OWNER') && (
          <GetStartedPage clientId={workspace.clientId} />
        )}
        {workspace.role === 'PREPARER' && <PreparerDashboard />}
        {workspace.role === 'REVIEWER' && <ReviewerDashboard />}
        {workspace.role === 'ADMIN' && <AdminDashboard />}
        {workspace.role === 'SEASONAL_STAFF' && <SeasonalDashboard />}
      </motion.div>
    </AnimatePresence>
  )
}
