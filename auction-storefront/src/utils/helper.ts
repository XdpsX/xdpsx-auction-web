import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  scope: string
}

export const getRolesFromToken = (token: string): string[] => {
  const decodedToken = jwtDecode<DecodedToken>(token)
  const scope = decodedToken.scope
  return scope.split(' ')
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
