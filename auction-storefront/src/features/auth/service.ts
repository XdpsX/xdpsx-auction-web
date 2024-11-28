import {
  AccountCreateRequest,
  LoginRequest,
  RegisterRequest,
} from '../../models/auth.type'
import { Token } from '../../models/token.type'
import api from '../../utils/api'

export const registerAPI = async (payload: RegisterRequest) => {
  const response = await api.post('/auth/register', payload)
  return response.data
}

export const sendOTPAPI = async (payload: { email: string }) => {
  await api.post('/otp/mail', payload)
}

export const createAccountAPI = async (payload: AccountCreateRequest) => {
  const response = await api.post<Token>('/auth/create-account', payload)
  return response.data
}

export const loginAPI = async (payload: LoginRequest) => {
  const response = await api.post<Token>('/auth/login', payload)
  return response.data
}

export const logoutAPI = async () => {
  await api.post('/auth/logout')
}
