import { Navigate } from 'react-router-dom'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  // const isAuthenticated = false

  // if (!isAuthenticated) {
  //   return <Navigate to='/login' replace />
  // }
  return children
}
export default PrivateRoute
