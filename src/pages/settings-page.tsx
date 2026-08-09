import { Settings } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export function SettingsPage() {
  return (
    <PageContainer>
      <PageHeader title="Settings" description="Manage your profile, firm, team, and preferences." />
      <EmptyState
        icon={Settings}
        title="Coming soon"
        description="Profile, team, billing, and workspace settings are on the roadmap."
      />
    </PageContainer>
  )
}
