import { Order, OrderStatus } from '../../models/order.type'
import { Page } from '../../models/page.type'
import api from '../../utils/api'

export const fetchMyOrdersAPI = async (
  pageNum: number,
  pageSize: number,
  keyword: string | null,
  sort: string,
  status: OrderStatus
) => {
  const response = await api.get<Page<Order>>(`/storefront/users/me/orders`, {
    params: {
      pageNum,
      pageSize,
      keyword,
      sort,
      status,
    },
  })
  return response.data
}
