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
        // path: '/',
        index: true,
        roles: ['ADMIN', 'SELLER']
      },
      {
        key: 'auctions-trashed',
        title: 'Trashed',
        path: '/auctions/trashed',
        roles: ['ADMIN']
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
  },
  {
    key: 'orders',
    title: 'Orders',
    path: '/orders',
    icon: 'solar:box-linear',
    group: true,
    children: [
      {
        key: 'pending-orders',
        title: 'Pending Orders',
        path: '/orders/Pending'
      },
      {
        key: 'confirmed-orders',
        title: 'Confirmed Orders',
        path: '/orders/Confirmed'
      },
      {
        key: 'shipped-orders',
        title: 'Shipped Orders',
        path: '/orders/Shipped'
      },
      {
        key: 'delivered-orders',
        title: 'Delivered Orders',
        path: '/orders/Delivered'
      },
      {
        key: 'completed-orders',
        title: 'Completed Orders',
        path: '/orders/Completed'
      },
      {
        key: 'cancelled-orders',
        title: 'Cancelled Orders',
        path: '/orders/Cancelled'
      },
      {
        key: 'returned-orders',
        title: 'Returned Orders',
        path: '/orders/Returned'
      }
    ]
  },
  {
    key: 'withdrawal',
    title: 'Withdrawal',
    path: '/withdrawal',
    icon: 'ph:hand-withdraw',
    group: true,
    children: [
      {
        key: 'withdrawal-list',
        title: 'List',
        index: true
      },
      {
        key: 'withdrawal-request',
        title: 'Request List',
        path: '/withdrawal/request-list',
        roles: ['ADMIN']
      }
    ]
  }
]
export default sidebarItems
