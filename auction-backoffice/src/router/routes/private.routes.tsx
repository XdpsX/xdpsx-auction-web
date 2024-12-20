import { lazy, Suspense } from 'react'
import MainLayout from '~/layouts/MainLayout'
import PrivateRoute from '../guards/PrivateRoute'
import { Navigate } from 'react-router-dom'
import LoadingOverlay from '~/components/LoadingOverlay'
import RoleProtected from '../guards/RoleProtected'
import OrderList from '~/pages/order/OrderList'
import WithdrawalList from '~/pages/withdrawal/WithdrawalList'
import OrderDetailsPage from '~/pages/order/OrderDetailsPage'
import NotFound from '~/pages/error/NotFound'
import AuctionDetailsPage from '~/pages/auction/AuctionDetailsPage'
import Dashboard from '~/pages/Dashboard'

const CategoriesList = lazy(() => import('~/pages/category/CategoriesList'))
const AuctionsList = lazy(() => import('~/pages/auction/AuctionsList'))
const AuctionAdd = lazy(() => import('~/pages/auction/AuctionAdd'))
const SellerList = lazy(() => import('~/pages/seller/SellerList'))

const privateRoutes = [
  {
    path: '/',
    element: <Navigate to='/dashboard' replace />
  },
  {
    element: (
      <PrivateRoute>
        <Suspense fallback={<LoadingOverlay />}>
          <MainLayout />
        </Suspense>
      </PrivateRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/categories',
        element: (
          <RoleProtected roles={['ADMIN']}>
            <CategoriesList />
          </RoleProtected>
        )
      },
      {
        path: '/auctions',
        element: <AuctionsList />
      },
      {
        path: '/auctions/add',
        element: (
          <RoleProtected roles={['SELLER']}>
            <AuctionAdd />
          </RoleProtected>
        )
      },
      {
        path: '/auctions/trashed',
        element: (
          <RoleProtected roles={['ADMIN']}>
            <AuctionsList page='trashed' />
          </RoleProtected>
        )
      },
      {
        path: '/auctions/details/:id',
        element: <AuctionDetailsPage />
      },
      {
        path: '/sellers',
        element: (
          <RoleProtected roles={['ADMIN']}>
            <SellerList />
          </RoleProtected>
        )
      },
      {
        path: '/sellers/register-list',
        element: (
          <RoleProtected roles={['ADMIN']}>
            <SellerList page='register-list' />
          </RoleProtected>
        )
      },
      {
        path: '/orders/:status',
        element: <OrderList />
      },
      {
        path: '/orders/details/:id',
        element: <OrderDetailsPage />
      },
      {
        path: '/withdrawal',
        element: <WithdrawalList page='list' />
      },
      {
        path: '/withdrawal/request-list',
        element: (
          <RoleProtected roles={['ADMIN']}>
            <WithdrawalList page='request-list' />
          </RoleProtected>
        )
      }
    ]
  },
  {
    path: '/not-found',
    element: <NotFound />
  }
]

export default privateRoutes
