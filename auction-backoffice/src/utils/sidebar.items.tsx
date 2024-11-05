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
    key: 'auctions',
    title: 'Auctions',
    icon: 'solar:sledgehammer-outline',
    type: SidebarItemType.Nest,
    items: [
      {
        key: 'shareholders',
        path: '/auctions',
        title: 'List'
      },
      {
        key: 'note_holders',

        path: '#',
        title: 'Note Holders'
      },
      {
        key: 'transactions_log',
        path: '#',
        title: 'Transactions Log'
      }
    ]
  }
]

export default sidebarItems
