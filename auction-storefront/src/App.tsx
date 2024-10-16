import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import PageTitle from './components/ui/PageTitle'
import Home from './pages/Home'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    element: <AuthLayout />,
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
])

function App() {
  return <RouterProvider router={router} />
}
export default App
