import {
  RiLockPasswordLine,
  RiAuctionLine,
  RiBankLine,
  RiProfileLine,
  RiWallet3Line,
  RiShoppingCartLine,
} from 'react-icons/ri'
import { BiDish } from 'react-icons/bi'
import { BsPersonPlus } from 'react-icons/bs'
import { SidebarLinkType } from '../components/layout/UserSidebar'

export const sidebarLinks: SidebarLinkType[] = [
  {
    to: '/user/profile',
    icon: RiProfileLine,
    title: 'My Account',
  },
  {
    to: '/user/change-password',
    icon: RiLockPasswordLine,
    title: 'Password',
  },
  {
    to: '/wallet/deposit',
    icon: RiWallet3Line,
    title: 'Deposite',
  },
  {
    to: '/wallet/withdraw',
    icon: RiBankLine,
    title: 'Withdraw',
  },
  {
    to: '/user/auctions',
    icon: RiAuctionLine,
    title: 'Auctions',
  },
  {
    to: '/user/bids',
    icon: BiDish,
    title: 'Bids',
  },
  {
    to: '/user/seller-register',
    icon: BsPersonPlus,
    title: 'Seller Register',
    exceptRole: 'SELLER',
  },
  {
    to: '/user/orders',
    icon: RiShoppingCartLine,
    title: 'Orders',
    group: true,
    children: [
      {
        to: '/user/orders?status=Pending',
        title: 'Pending Orders',
      },
      {
        to: '/user/orders?status=Confirmed',
        title: 'Confirmed Orders',
      },
      {
        to: '/user/orders?status=Shipped',
        title: 'Shipped Orders',
      },
      {
        to: '/user/orders?status=Delivered',
        title: 'Delivered Orders',
      },
      {
        to: '/user/orders?status=Cancelled',
        title: 'Cancelled Orders',
      },
      {
        to: '/user/orders?status=Returned',
        title: 'Returned Orders',
      },
    ],
  },
]
