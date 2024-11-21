import { DepositPayload, Transaction } from '../../models/transaction.type'
import api from '../../utils/api'
import { fromAxiosErrorToAPIError } from '../../utils/error.helper'

export const depositAPI = async (payload: DepositPayload): Promise<string> => {
  try {
    const response = await api.post('/storefront/transactions/deposit', payload)
    return response.data.paymentUrl
  } catch (error) {
    throw fromAxiosErrorToAPIError(error)
  }
}

export const depositCallbackAPI = async (
  params: string
): Promise<Transaction> => {
  try {
    const response = await api.get<Transaction>(
      `/storefront/transactions/deposit/callback?${params}`
    )
    return response.data
  } catch (error) {
    throw fromAxiosErrorToAPIError(error)
  }
}