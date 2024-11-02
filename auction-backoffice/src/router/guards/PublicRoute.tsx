import { Navigate } from 'react-router-dom'
import { useAppSelector } from '~/app/hooks'

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAppSelector((state) => state.auth)
  const isAuthenticated = !!accessToken

  if (isAuthenticated) {
    return <Navigate to='/' replace />
  }
  return children
}
export default PublicRoute
