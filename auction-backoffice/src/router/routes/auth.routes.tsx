import { lazy, Suspense } from 'react'
import PublicRoute from '../guards/PublicRoute'
import AuthLayout from '~/layouts/AuthLayout'
import LoadingOverlay from '~/components/shared/LoadingOverlay'

const Login = lazy(() => import('~/pages/auth/Login'))
const Register = lazy(() => import('~/pages/auth/Register'))

const authRoutes = [
  {
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        path: '/login',
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <Login />
          </Suspense>
        )
      },
      {
        path: '/register',
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <Register />
          </Suspense>
        )
      }
    ]
  }
]

export default authRoutes
