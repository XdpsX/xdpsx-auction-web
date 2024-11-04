import { type SidebarItem, SidebarItemType } from '~/components/layout/Sidebar/type'

const sidebarItems: SidebarItem[] = [
  {
    key: 'dashboard',
    path: '/',
    icon: 'solar:chat-square-2-linear',
    title: 'Dashboard'
  },
  {
    key: 'categories',
    path: '/categories',
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
        path: '#',
        title: 'Shareholders'
      },
      {
        key: 'note_holders',
        icon: 'solar:notes-outline',
        path: '#',
        title: 'Note Holders'
      },
      {
        key: 'transactions_log',
        icon: 'solar:clipboard-list-linear',
        path: '#',
        title: 'Transactions Log'
      }
    ]
  }
]

export default sidebarItems
