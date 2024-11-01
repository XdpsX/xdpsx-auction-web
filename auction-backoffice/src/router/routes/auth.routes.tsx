import Login from '~/pages/auth/Login'
import Register from '~/pages/auth/Register'
import PublicRoute from '../guards/PublicRoute'
import AuthLayout from '~/layouts/AuthLayout'

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
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      }
    ]
  }
]

export default authRoutes
