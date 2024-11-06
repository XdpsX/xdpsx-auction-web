import { LoginPayload } from '~/app/features/auth/type'
import api from '~/utils/api'

export const loginAPI = async (payload: LoginPayload) => {
  const response = await api.post('/auth/login', payload)
  return response.data
}

export const logoutAPI = async () => {
  await api.post('/auth/logout')
}
