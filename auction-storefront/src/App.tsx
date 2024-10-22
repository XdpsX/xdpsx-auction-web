import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import authRoutes from './routes/auth.routes'
import MainLayout from './layouts/MainLayout'
import PageTitle from './components/layout/PageTitle'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { selectAuth } from './features/auth/auth.slice'
import { getUserProfile } from './features/user/user.thunk'

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
  ...authRoutes,
])

function App() {
  const dispatch = useAppDispatch()
  const { accessToken } = useAppSelector(selectAuth)
  useEffect(() => {
    if (accessToken) {
      dispatch(getUserProfile())
    }
  }, [accessToken, dispatch])
  return <RouterProvider router={router} />
}
export default App
