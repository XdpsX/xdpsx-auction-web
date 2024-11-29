import { Navigate } from 'react-router-dom'
import useAppSelector from '~/app/hooks/useAppSelector'

function RoleProtected({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { userRole } = useAppSelector((state) => state.user)
  if (roles && userRole && !roles.includes(userRole)) {
    return <Navigate to='/' replace />
  }

  return children
}
export default RoleProtected
