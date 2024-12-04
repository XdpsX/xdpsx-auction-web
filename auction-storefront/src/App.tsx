import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { selectAuth } from './features/auth/slice'
import {
  fetchUserProfileAsync,
  selectUser,
  setRoles,
  setUserProfile,
} from './features/user/slice'
import LoadingOverlay from './components/ui/LoadingOverlay'
import {
  fetchMyWalletAsync,
  selectWallet,
  setWallet,
} from './features/wallet/slice'
import errorRoutes from './routes/errorRoutes'
import mainRoutes from './routes/mainRoutes'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'

const router = createBrowserRouter([
  ...mainRoutes,
  ...authRoutes,
  ...userRoutes,
  ...errorRoutes,
])

function App() {
  const dispatch = useAppDispatch()
  const { accessToken } = useAppSelector(selectAuth)
  const { isFetching } = useAppSelector(selectUser)
  const { isLoading } = useAppSelector(selectWallet)

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchUserProfileAsync())
      dispatch(setRoles(accessToken))
      dispatch(fetchMyWalletAsync())
    } else {
      dispatch(setUserProfile(null))
      dispatch(setRoles(null))
      dispatch(setWallet(null))
    }
  }, [accessToken, dispatch])
  if (isFetching || isLoading) {
    return (
      <div className="relative h-screen">
        <LoadingOverlay />
      </div>
    )
  }
  return <RouterProvider router={router} />
}
export default App
