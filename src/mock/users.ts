import type { User } from '@/types'

export const users: User[] = [
  {
    id: 'usr_1',
    name: 'Sarah Chen',
    email: 'sarah.chen@harborviewtax.com',
    role: 'admin',
    title: 'Managing Partner',
    organizationId: 'org_1',
    initials: 'SC',
  },
  {
    id: 'usr_2',
    name: 'Marcus Webb',
    email: 'marcus.webb@harborviewtax.com',
    role: 'preparer',
    title: 'Senior Tax Preparer',
    organizationId: 'org_1',
    initials: 'MW',
  },
  {
    id: 'usr_3',
    name: 'Priya Nathan',
    email: 'priya.nathan@harborviewtax.com',
    role: 'reviewer',
    title: 'Tax Manager',
    organizationId: 'org_1',
    initials: 'PN',
  },
  {
    id: 'usr_4',
    name: 'Devon Ellis',
    email: 'devon.ellis@harborviewtax.com',
    role: 'preparer',
    title: 'Tax Preparer',
    organizationId: 'org_1',
    initials: 'DE',
  },
  {
    id: 'usr_5',
    name: 'Alicia Romero',
    email: 'alicia.romero@harborviewtax.com',
    role: 'preparer',
    title: 'Tax Preparer',
    organizationId: 'org_1',
    initials: 'AR',
  },
  {
    id: 'usr_6',
    name: 'James Okafor',
    email: 'james.okafor@harborviewtax.com',
    role: 'reviewer',
    title: 'Senior Manager',
    organizationId: 'org_1',
    initials: 'JO',
  },
  {
    id: 'usr_7',
    name: 'Laura Bennett',
    email: 'laura@bennettdesignstudio.com',
    role: 'client',
    title: 'Owner, Bennett Design Studio',
    organizationId: 'org_1',
    initials: 'LB',
  },
  {
    id: 'usr_8',
    name: 'Michael Tran',
    email: 'michael.tran@gmail.com',
    role: 'client',
    title: 'Client',
    organizationId: 'org_1',
    initials: 'MT',
  },
]

/** The signed-in user for this session — no auth, so we just fix it. */
export const currentUser = users[0]!

export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id)
}
