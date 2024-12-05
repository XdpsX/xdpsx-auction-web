import { Page } from '../../models/page.type'
import { DepositPayload, Transaction } from '../../models/transaction.type'
import api from '../../utils/api'
import { fromAxiosErrorToAPIError } from '../../utils/error.helper'

export const depositAPI = async (payload: DepositPayload): Promise<string> => {
  try {
    const response = await api.post('/storefront/wallets/deposit', payload)
    return response.data.paymentUrl
  } catch (error) {
    throw fromAxiosErrorToAPIError(error)
  }
}

export const depositCallbackAPI = async (
  params: string
): Promise<Transaction> => {
  try {
    const response = await api.post<Transaction>(
      `/storefront/wallets/deposit/callback?${params}`
    )
    return response.data
  } catch (error) {
    throw fromAxiosErrorToAPIError(error)
  }
}

export const fetchMyTransactionsAPI = async (
  pageNum: number,
  pageSize: number,
  sort: string,
  type: string | null
) => {
  const response = await api.get<Page<Transaction>>(
    `/storefront/users/me/transactions`,
    {
      params: {
        pageNum,
        pageSize,
        sort,
        type,
      },
    }
  )
  return response.data
}
