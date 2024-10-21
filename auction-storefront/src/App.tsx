import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import authRoutes from './routes/auth.routes'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  ...authRoutes,
])

function App() {
  return <RouterProvider router={router} />
}
export default App
