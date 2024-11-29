import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import { selectUser } from '../../features/user/user.slice'
import { ReactNode } from 'react'

const NonRoleProtected = ({
  children,
  exceptRole,
}: {
  children: ReactNode
  exceptRole: string
}) => {
  const { roles } = useAppSelector(selectUser)

  if (roles?.includes(exceptRole)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default NonRoleProtected
