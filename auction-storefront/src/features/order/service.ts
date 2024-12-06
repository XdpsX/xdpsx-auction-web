import { Order, OrderStatus, CreateOrderPayload } from '../../models/order.type'
import { Page } from '../../models/page.type'
import api from '../../utils/api'
import { fromAxiosErrorToAPIError } from '../../utils/error.helper'

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

export const cancelOrderAPI = async (orderId: number) => {
  const response = await api.put<Order>(`/storefront/orders/${orderId}/cancel`)
  return response.data
}

export const confirmOrderAPI = async (orderId: number) => {
  const response = await api.put<Order>(`/storefront/orders/${orderId}/confirm`)
  return response.data
}

export const createOrderAPI = async (payload: CreateOrderPayload) => {
  const response = await api.post<Order>('/storefront/orders', payload)
  return response.data
}

export const createOrderPaymentLinkAPI = async (
  payload: CreateOrderPayload
) => {
  const response = await api.post('/storefront/orders/external', payload)
  return response.data.paymentUrl
}

export const createOrderExternalCallbackAPI = async (params: string) => {
  try {
    const response = await api.post<Order>(
      `/storefront/orders/external/callback?${params}`
    )
    return response.data
  } catch (error) {
    throw fromAxiosErrorToAPIError(error)
  }
}
