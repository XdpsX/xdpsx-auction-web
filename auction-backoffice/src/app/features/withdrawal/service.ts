import api from '~/utils/api'
import { UpdateWithdrawStatusPayload, Withdraw, WithdrawStatusParam } from './type'
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

export const updateWithdrawStatusAPI = async (withdrawId: number, payload: UpdateWithdrawStatusPayload) => {
  const response = await api.put<Withdraw>(`/backoffice/withdraw/${withdrawId}/status`, payload)
  return response.data
}
