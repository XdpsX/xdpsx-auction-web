import MainLayout from '~/layouts/MainLayout'
import PrivateRoute from '../guards/PrivateRoute'
import Categories from '~/pages/category/Categories'
import Dashboard from '~/pages/Dashboard'

const privateRoutes = [
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: '/categories',
        element: <Categories />
      }
    ]
  }
]

export default privateRoutes