import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import BidsPage from '../pages/user/BidsPage'
import ChangePasswordPage from '../pages/user/ChangePasswordPage'
import Deposit from '../pages/user/Deposit'
import Profile from '../pages/user/Profile'
import SellerRegisterPage from '../pages/user/SellerRegisterPage'
import LinkRouteType from '../routes/type'

export const authLinks: LinkRouteType[] = [
  {
    title: 'Login | Auction',
    path: '/login',
    element: Login,
  },
  {
    title: 'Register | Auction',
    path: '/register',
    element: Register,
  },
]

export const userLinks = [
  {
    title: 'Profile',
    path: '/user/profile',
    element: Profile,
  },
  {
    title: 'Change Password',
    path: '/user/change-password',
    element: ChangePasswordPage,
  },
  {
    title: 'Wallet | Deposite',
    path: '/wallet/deposit',
    element: Deposit,
  },
  {
    title: 'My Bids',
    path: '/user/bids',
    element: BidsPage,
  },
  {
    title: 'Seller Register',
    path: '/user/seller-register',
    element: SellerRegisterPage,
    exceptRole: 'SELLER',
  },
]
