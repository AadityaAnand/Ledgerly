import type { RoleDefinition } from '@/types'

export const roleDefinitions: RoleDefinition[] = [
  {
    role: 'admin',
    label: 'Admin',
    description: 'Full access to every client, return, and firm setting.',
    permissions: [
      'returns.view',
      'returns.edit',
      'returns.approve',
      'documents.view',
      'documents.upload',
      'clients.manage',
      'billing.manage',
      'settings.manage',
    ],
  },
  {
    role: 'reviewer',
    label: 'Reviewer',
    description: 'Can review and approve returns prepared by others.',
    permissions: ['returns.view', 'returns.edit', 'returns.approve', 'documents.view', 'documents.upload'],
  },
  {
    role: 'preparer',
    label: 'Preparer',
    description: 'Prepares returns and manages assigned clients.',
    permissions: ['returns.view', 'returns.edit', 'documents.view', 'documents.upload', 'clients.manage'],
  },
  {
    role: 'client',
    label: 'Client',
    description: 'Can upload documents and message their preparer.',
    permissions: ['returns.view', 'documents.view', 'documents.upload'],
  },
]
