import api from '~/utils/api'
import { Wallet } from './type'

export const fetchMyWalletAPI = async () => {
  const response = await api.get<Wallet>('/backoffice/wallets/me')
  return response.data
}
