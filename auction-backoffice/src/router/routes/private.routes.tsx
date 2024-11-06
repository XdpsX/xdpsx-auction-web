import { lazy, Suspense } from 'react'
import MainLayout from '~/layouts/MainLayout'
import PrivateRoute from '../guards/PrivateRoute'
import { Navigate } from 'react-router-dom'
import LoadingOverlay from '~/components/shared/LoadingOverlay'

const Categories = lazy(() => import('~/pages/category/Categories'))
const Dashboard = lazy(() => import('~/pages/Dashboard'))
const Auctions = lazy(() => import('~/pages/auction/Auctions'))

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
            <Categories />
          </Suspense>
        )
      },
      {
        path: '/auctions',
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <Auctions />
          </Suspense>
        )
      }
    ]
  }
]

export default privateRoutes
