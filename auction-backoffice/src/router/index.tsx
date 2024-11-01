import { createBrowserRouter } from 'react-router-dom'
import authRoutes from './routes/auth.routes'

const appRouter = createBrowserRouter([...authRoutes])

export default appRouter
