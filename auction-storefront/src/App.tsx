import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import authRoutes from './routes/auth.routes'
import MainLayout from './layouts/MainLayout'
import PageTitle from './components/layout/PageTitle'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { selectAuth } from './features/auth/auth.slice'
import { getUserProfile } from './features/user/user.thunk'
import { selectUser, setUserProfile } from './features/user/user.slice'
import LoadingOverlay from './components/ui/LoadingOverlay'
import OAuth2RedirectHandler from './pages/redirect/OAuth2RedirectHandler'
import AuthRoute from './components/route/AuthRoute'
import UserLayout from './layouts/UserLayout'
import ProtectedRoute from './components/route/ProtectedRoute'
import Profile from './pages/Profile'
import Deposit from './pages/Deposit'
import PaymentRedirect from './pages/redirect/PaymentRedirect'
import PaymentHandler from './pages/handler/PaymentSuccess'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <>
            <PageTitle title="Home" />
            <Home />
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
  {
    path: '/transactions/:transactionId/payment/redirect',
    element: (
      <ProtectedRoute>
        <PaymentRedirect />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payment/handler',
    element: (
      <ProtectedRoute>
        <PaymentHandler />
      </ProtectedRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/user/profile',
        element: (
          <>
            <PageTitle title="Profile" />
            <Profile />
          </>
        ),
      },
      {
        path: '/wallet/deposit',
        element: (
          <>
            <PageTitle title="Wallet | Deposite" />
            <Deposit />
          </>
        ),
      },
    ],
  },
  ...authRoutes,
])

function App() {
  const dispatch = useAppDispatch()
  const { accessToken } = useAppSelector(selectAuth)
  const { isFetching } = useAppSelector(selectUser)

  useEffect(() => {
    if (accessToken) {
      dispatch(getUserProfile())
    } else {
      dispatch(setUserProfile(null))
    }
  }, [accessToken, dispatch])
  if (isFetching) {
    return (
      <div className="relative h-screen">
        <LoadingOverlay />
      </div>
    )
  }
  return <RouterProvider router={router} />
}
export default App
