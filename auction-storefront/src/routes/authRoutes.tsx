import AuthRoute from '../components/route/AuthRoute'
import PageTitle from '../components/layout/PageTitle'
import AuthLayout from '../layouts/AuthLayout'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import OAuth2RedirectHandler from '../pages/redirect/OAuth2RedirectHandler'

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
  {
    path: '/oauth2/redirect',
    element: (
      <AuthRoute>
        <OAuth2RedirectHandler />
      </AuthRoute>
    ),
  },
]

export default authRoutes
