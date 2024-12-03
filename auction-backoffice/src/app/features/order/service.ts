import api from '~/utils/api'
import { Page } from '../page/type'
import { Order, OrderStatus } from './type'

export const fetchMyOrdersAPI = async (
  pageNum: number,
  pageSize: number,
  keyword: string | null,
  sort: string,
  status: OrderStatus
) => {
  const response = await api.get<Page<Order>>(`/backoffice/sellers/me/orders`, {
    params: {
      pageNum,
      pageSize,
      keyword,
      sort,
      status
    }
  })
  return response.data
}

export const updateOrderStatusAPI = async (orderId: number) => {
  const response = await api.put<Order>(`/backoffice/orders/${orderId}/update-status`)
  return response.data
}
