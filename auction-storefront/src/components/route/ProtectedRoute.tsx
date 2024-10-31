import { Navigate } from 'react-router-dom'
import { selectAuth } from '../../features/auth/auth.slice'
import { useAppSelector } from '../../store/hooks'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAppSelector(selectAuth)
  const isAuthenticated = !!accessToken

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}
export default ProtectedRoute
