import { useRoutes } from 'react-router-dom'
import privateRoutes from './routes/private.routes'
import authRoutes from './routes/auth.routes'

function AppRouter() {
  const routes = useRoutes([...privateRoutes, ...authRoutes])
  return routes
}
export default AppRouter
