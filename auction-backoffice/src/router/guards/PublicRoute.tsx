import { Navigate } from 'react-router-dom'

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = false

  if (isAuthenticated) {
    return <Navigate to='/' replace />
  }
  return children
}
export default PublicRoute
