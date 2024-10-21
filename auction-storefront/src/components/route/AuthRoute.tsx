import { Navigate } from 'react-router-dom'
import { selectAuth } from '../../features/auth/auth.slice'
import { useAppSelector } from '../../store/hooks'

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAppSelector(selectAuth)
  const isAuthenticated = !!accessToken

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}
export default AuthRoute
