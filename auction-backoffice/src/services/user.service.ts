import { User } from '~/types/user'
import api from '~/utils/api'

export const fetchUserProfileAPI = async (): Promise<User> => {
  const response = await api.get<User>('/backoffice/users/me')
  return response.data
}
