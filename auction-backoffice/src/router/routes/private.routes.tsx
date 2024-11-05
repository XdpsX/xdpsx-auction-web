import MainLayout from '~/layouts/MainLayout'
import PrivateRoute from '../guards/PrivateRoute'
import Categories from '~/pages/category/Categories'
import Dashboard from '~/pages/Dashboard'
import Auctions from '~/pages/auction/Auctions'
import { Navigate } from 'react-router-dom'

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
        element: <Dashboard />
      },
      {
        path: '/categories',
        element: <Categories />
      },
      {
        path: '/auctions',
        element: <Auctions />
      }
    ]
  }
]

export default privateRoutes
