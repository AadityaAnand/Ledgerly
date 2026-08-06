import type { Organization } from '@/types'

export const organizations: Organization[] = [
  {
    id: 'org_1',
    name: 'Harborview Tax & Advisory',
    slug: 'harborview',
    plan: 'professional',
    memberCount: 6,
    clientCount: 8,
  },
  {
    id: 'org_2',
    name: 'Harborview Sandbox',
    slug: 'harborview-sandbox',
    plan: 'starter',
    memberCount: 1,
    clientCount: 0,
  },
]

export const currentOrganization = organizations[0]!
