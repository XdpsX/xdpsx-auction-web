import { type SidebarItem, SidebarItemType } from '~/components/layout/Sidebar/type'

const sidebarItems: SidebarItem[] = [
  {
    key: 'test',
    href: '/',
    icon: 'solar:chat-square-2-linear',
    title: 'test',
    className: 'hidden'
  },
  {
    key: 'dashboard',
    href: '/',
    icon: 'solar:chat-square-2-linear',
    title: 'Dashboard'
  },
  {
    key: 'categories',
    href: '/categories',
    icon: 'solar:widget-outline',
    title: 'Categories'
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
  }
]

export default sidebarItems
