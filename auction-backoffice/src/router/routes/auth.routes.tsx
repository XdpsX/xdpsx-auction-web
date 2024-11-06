import { lazy, Suspense } from 'react'
import PublicRoute from '../guards/PublicRoute'
import AuthLayout from '~/layouts/AuthLayout'
import LoadingOverlay from '~/components/LoadingOverlay'
import { Helmet } from 'react-helmet'

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
            <Helmet>
              <title>Login your Account | Auction Backoffice</title>
              <meta name='description' content='Login to your account to manage your auctions' />
            </Helmet>
            <Login />
          </Suspense>
        )
      },
      {
        path: '/register',
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <Helmet>
              <title>Create your Account | Auction Backoffice</title>
              <meta name='description' content="Let's start to create your first auction" />
            </Helmet>
            <Register />
          </Suspense>
        )
      }
    ]
  }
]

export default authRoutes
