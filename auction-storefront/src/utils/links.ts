import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import BidsPage from '../pages/user/BidsPage'
import ChangePasswordPage from '../pages/user/ChangePasswordPage'
import DepositPage from '../pages/user/DepositPage'
import ProfilePage from '../pages/user/ProfilePage'
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
    element: ProfilePage,
  },
  {
    title: 'Change Password',
    path: '/user/change-password',
    element: ChangePasswordPage,
  },
  {
    title: 'Wallet | Deposite',
    path: '/wallet/deposit',
    element: DepositPage,
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