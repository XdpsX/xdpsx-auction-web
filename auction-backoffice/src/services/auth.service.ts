import { LoginPayload } from '~/types/auth'
import api from '~/utils/api'

export const loginAPI = async (payload: LoginPayload) => {
  const response = await api.post('/auth/login', payload)
  return response.data
}
