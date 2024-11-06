import { lazy, Suspense } from 'react'
import MainLayout from '~/layouts/MainLayout'
import PrivateRoute from '../guards/PrivateRoute'
import { Navigate } from 'react-router-dom'
import LoadingOverlay from '~/components/LoadingOverlay'

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
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <Dashboard />
          </Suspense>
        )
      },
      {
        path: '/categories',
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <CategoriesList />
          </Suspense>
        )
      },
      {
        path: '/auctions',
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <AuctionsList />
          </Suspense>
        )
      }
    ]
  }
]

export default privateRoutes
