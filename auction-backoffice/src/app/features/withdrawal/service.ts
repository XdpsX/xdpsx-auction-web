import api from '~/utils/api'
import { Withdraw } from './type'
import { Page } from '../page/type'

export const fetchWithdrawalsAPI = async (pageNum: number, pageSize: number, sort: string, statuses: string) => {
  const response = await api.get<Page<Withdraw>>('/backoffice/withdraw', {
    params: {
      pageNum,
      pageSize,
      sort,
      statuses
    }
  })
  return response.data
}
