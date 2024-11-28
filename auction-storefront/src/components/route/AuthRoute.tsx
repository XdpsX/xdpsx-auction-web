import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import { selectAuth } from '../../features/auth/slice'

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAppSelector(selectAuth)
  const isAuthenticated = !!accessToken

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}
export default AuthRoute
