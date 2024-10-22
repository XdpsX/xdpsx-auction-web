import { Navigate } from 'react-router-dom'

function AuthRoute({ children }: { children: React.ReactNode }) {
  const accessToken = localStorage.getItem('accessToken')
  const isAuthenticated = !!accessToken

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}
export default AuthRoute
