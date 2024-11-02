import { createBrowserRouter } from 'react-router-dom'
import authRoutes from './routes/auth.routes'
import privateRoutes from './routes/private.routes'

const appRouter = createBrowserRouter([...authRoutes, ...privateRoutes])

export default appRouter
