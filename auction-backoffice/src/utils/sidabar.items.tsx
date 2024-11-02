import { Chip } from '@nextui-org/react'
import { Icon } from '@iconify/react'

import { type SidebarItem, SidebarItemType } from '~/components/layout/Sidebar/type'

const sidebarItems: SidebarItem[] = [
  {
    key: 'dashboard',
    href: '#',
    icon: 'solar:chat-square-2-linear',
    title: 'Dashboard'
  },
  {
    key: 'categories',
    href: '#',
    icon: 'solar:widget-outline',
    title: 'Categories'
  },
  {
    key: 'tasks',
    href: '#',
    icon: 'solar:checklist-minimalistic-outline',
    title: 'Tasks',
    endContent: <Icon className='text-default-400' icon='solar:add-circle-line-duotone' width={24} />
  },
  {
    key: 'team',
    href: '#',
    icon: 'solar:users-group-two-rounded-outline',
    title: 'Team'
  },
  {
    key: 'tracker',
    href: '#',
    icon: 'solar:sort-by-time-linear',
    title: 'Tracker',
    endContent: (
      <Chip size='sm' variant='flat'>
        New
      </Chip>
    )
  },
  {
    key: 'analytics',
    href: '#',
    icon: 'solar:chart-outline',
    title: 'Analytics'
  },
  {
    key: 'perks',
    href: '#',
    icon: 'solar:gift-linear',
    title: 'Perks',
    endContent: (
      <Chip size='sm' variant='flat'>
        3
      </Chip>
    )
  },
  {
    key: 'cap_table',
    title: 'Cap Table',
    icon: 'solar:pie-chart-2-outline',
    type: SidebarItemType.Nest,
    items: [
      {
        key: 'shareholders',
        icon: 'solar:users-group-rounded-linear',
        href: '#',
        title: 'Shareholders'
      },
      {
        key: 'note_holders',
        icon: 'solar:notes-outline',
        href: '#',
        title: 'Note Holders'
      },
      {
        key: 'transactions_log',
        icon: 'solar:clipboard-list-linear',
        href: '#',
        title: 'Transactions Log'
      }
    ]
  },
  {
    key: 'expenses',
    href: '#',
    icon: 'solar:bill-list-outline',
    title: 'Expenses'
  }
]

export default sidebarItems
