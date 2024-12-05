import { Page } from '../../models/page.type'
import {
  Wallet,
  Withdraw,
  WithdrawPayload,
  WithdrawStatusParam,
} from '../../models/wallet.type'
import api from '../../utils/api'

export const fetchMyWalletAPI = async () => {
  const response = await api.get<Wallet>('/storefront/wallets/me')
  return response.data
}

export const fetchMyWithdrawalsAPI = async (
  pageNum: number,
  pageSize: number,
  sort: string,
  status: WithdrawStatusParam | null
) => {
  const response = await api.get<Page<Withdraw>>(
    '/storefront/wallets/me/withdraw',
    {
      params: {
        pageNum,
        pageSize,
        sort,
        status,
      },
    }
  )
  return response.data
}

export const createWithdrawAPI = async (payload: WithdrawPayload) => {
  const response = await api.post<Withdraw>(
    '/storefront/wallets/withdraw',
    payload
  )
  return response.data
}

export const cancelWithdrawAPI = async (id: number) => {
  await api.put<void>(`/storefront/withdraw/${id}/cancel`)
  return id
}
