import { lazy, Suspense } from 'react'
import MainLayout from '~/layouts/MainLayout'
import PrivateRoute from '../guards/PrivateRoute'
import { Navigate } from 'react-router-dom'
import LoadingOverlay from '~/components/LoadingOverlay'
import { Helmet } from 'react-helmet'
import RoleProtected from '../guards/RoleProtected'

const CategoriesList = lazy(() => import('~/pages/category/CategoriesList'))
const Dashboard = lazy(() => import('~/pages/Dashboard'))
const AuctionsList = lazy(() => import('~/pages/auction/AuctionsList'))
const AuctionAdd = lazy(() => import('~/pages/auction/AuctionAdd'))

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
        element: (
          <>
            <Helmet>
              <title>Dashboard | Auction Backoffice</title>
            </Helmet>
            <Dashboard />
          </>
        )
      },
      {
        path: '/categories',
        element: (
          <RoleProtected roles={['ADMIN']}>
            <Helmet>
              <title>Manage Categories | Auction Backoffice</title>
            </Helmet>
            <CategoriesList />
          </RoleProtected>
        )
      },
      {
        path: '/auctions',
        element: (
          <>
            <Helmet>
              <title>Manage Auctions | Auction Backoffice</title>
            </Helmet>
            <AuctionsList />
          </>
        )
      },
      {
        path: '/auctions/add',
        element: (
          <RoleProtected roles={['SELLER']}>
            <Helmet>
              <title>Create New Auction | Auction Backoffice</title>
            </Helmet>
            <AuctionAdd />
          </RoleProtected>
        )
      }
    ]
  }
]

export default privateRoutes
