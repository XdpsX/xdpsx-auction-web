import { SidebarItem } from '~/layouts/MainLayout/Sidebar/type'

const sidebarItems: SidebarItem[] = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    path: '/dashboard',
    icon: 'solar:chat-square-2-linear',
    roles: ['ADMIN', 'SELLER']
  },
  {
    key: 'categories',
    title: 'Categories',
    icon: 'solar:widget-outline',
    path: '/categories',
    group: true,
    roles: ['ADMIN'],
    children: [
      {
        key: 'categories-list',
        title: 'List',
        index: true
      }
    ]
  },
  {
    key: 'auctions',
    title: 'Auctions',
    icon: 'solar:sledgehammer-outline',
    path: '/auctions',
    group: true,
    children: [
      {
        key: 'auctions-list',
        title: 'List',
        path: '/',
        index: true,
        roles: ['ADMIN', 'SELLER']
      },
      {
        key: 'auctions-add',
        title: 'Add New Auction',
        path: '/auctions/add',
        roles: ['SELLER']
      }
    ]
  },
  // {
  //   key: 'sellers',
  //   title: 'Sellers',
  //   path: '/sellers',
  //   icon: 'material-symbols:person-outline',
  //   roles: ['ADMIN']
  // },
  {
    key: 'sellers',
    title: 'Sellers',
    path: '/sellers',
    icon: 'material-symbols:person-outline',
    group: true,
    roles: ['ADMIN'],
    children: [
      {
        key: 'sellers-list',
        title: 'List',
        index: true
      },
      {
        key: 'sellers-register',
        title: 'Register List',
        path: '/sellers/register-list'
      }
    ]
  }
]
export default sidebarItems
