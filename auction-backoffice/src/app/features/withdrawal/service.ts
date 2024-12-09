import api from '~/utils/api'
import { UpdateWithdrawStatusPayload, Withdraw, WithdrawPayload, WithdrawStatusParam } from './type'
import { Page } from '../page/type'

export const fetchListWithdrawalsAPI = async (
  pageNum: number,
  pageSize: number,
  sort: string,
  status: WithdrawStatusParam | null
) => {
  const response = await api.get<Page<Withdraw>>('/backoffice/withdraw/list', {
    params: {
      pageNum,
      pageSize,
      sort,
      status
    }
  })
  return response.data
}

export const fetchRequestWithdrawalsAPI = async (
  pageNum: number,
  pageSize: number,
  sort: string,
  status: WithdrawStatusParam | null
) => {
  const response = await api.get<Page<Withdraw>>('/backoffice/withdraw/request-list', {
    params: {
      pageNum,
      pageSize,
      sort,
      status
    }
  })
  return response.data
}

export const fetchMyWithdrawalRequest = async (
  pageNum: number,
  pageSize: number,
  sort: string,
  status: WithdrawStatusParam | null
) => {
  const response = await api.get<Page<Withdraw>>('/backoffice/wallets/me/withdraw', {
    params: {
      pageNum,
      pageSize,
      sort,
      status
    }
  })
  return response.data
}

export const createWithdrawAPI = async (payload: WithdrawPayload) => {
  const response = await api.post<Withdraw>('/backoffice/wallets/withdraw', payload)
  return response.data
}

export const cancelWithdrawAPI = async (id: number) => {
  await api.put<void>(`/backoffice/withdraw/${id}/cancel`)
  return id
}

export const updateWithdrawStatusAPI = async (withdrawId: number, payload: UpdateWithdrawStatusPayload) => {
  const response = await api.put<Withdraw>(`/backoffice/withdraw/${withdrawId}/status`, payload)
  return response.data
}
