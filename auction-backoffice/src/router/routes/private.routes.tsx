import { lazy, Suspense } from 'react'
import MainLayout from '~/layouts/MainLayout'
import PrivateRoute from '../guards/PrivateRoute'
import { Navigate } from 'react-router-dom'
import LoadingOverlay from '~/components/LoadingOverlay'
import { Helmet } from 'react-helmet'

const CategoriesList = lazy(() => import('~/pages/category/CategoriesList'))
const Dashboard = lazy(() => import('~/pages/Dashboard'))
const AuctionsList = lazy(() => import('~/pages/auction/AuctionsList'))

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
          <>
            <Helmet>
              <title>Manage Categories | Auction Backoffice</title>
            </Helmet>
            <CategoriesList />
          </>
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
      }
    ]
  }
]

export default privateRoutes
