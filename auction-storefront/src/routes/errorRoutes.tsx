import NotFoundPage from '../pages/error/NotFoundPage'

const errorRoutes = [
  { path: '/not-found', element: <NotFoundPage /> },
  { path: '*', element: <NotFoundPage /> },
]

export default errorRoutes
