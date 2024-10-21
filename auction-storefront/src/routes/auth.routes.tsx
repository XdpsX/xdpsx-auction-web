import AuthRoute from '../components/route/AuthRoute'
import PageTitle from '../components/ui/PageTitle'
import AuthLayout from '../layouts/AuthLayout'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

const authRoutes = [
  {
    element: (
      <AuthRoute>
        <AuthLayout />
      </AuthRoute>
    ),
    children: [
      {
        path: '/login',
        element: (
          <>
            <PageTitle title="Login | Auction" />
            <Login />
          </>
        ),
      },
      {
        path: '/register',
        element: (
          <>
            <PageTitle title="Register | Auction" />
            <Register />
          </>
        ),
      },
    ],
  },
]

export default authRoutes
