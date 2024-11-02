import { Navigate } from 'react-router-dom'
import { useAppSelector } from '~/app/hooks'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAppSelector((state) => state.auth)
  const isAuthenticated = !!accessToken

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }
  return children
}
export default PrivateRoute
