import * as Yup from 'yup'
import { formatPrice } from '~/utils/format'

export type WithdrawStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED'
export type Withdraw = {
  id: number
  bankName: string
  accountNumber: string
  holderName: string
  amount: number
  status: WithdrawStatus
  reason: string | null
  updatedAt: string
}
export enum WithdrawStatusParam {
  PENDING = 0,
  CONFIRMED = 1,
  COMPLETED = 2,
  REJECTED = 3,
  CANCELLED = 4
}

export type UpdateWithdrawStatusPayload = {
  status: WithdrawStatus
  reason?: string
}

export const createWithdrawRequestSchema = (maxAmount: number = 200_000_000) =>
  Yup.object().shape({
    bankName: Yup.string().required('Bank name is required').max(100, 'Bank name must be at most 100 characters long'),

    accountNumber: Yup.string()
      .required('Account number is required')
      .max(50, 'Account number must be at most 50 characters long'),

    holderName: Yup.string()
      .required('Holder name is required')
      .max(50, 'Holder name must be at most 50 characters long'),

    amount: Yup.number()
      .required('Amount is required')
      .positive('Amount must be a positive number')
      .min(50_000, 'Amount must be at least 50,000')
      .max(maxAmount, `Amount must be at most ${formatPrice(maxAmount)}`)
      .typeError('Amount must be a number')
  })

export type WithdrawPayload = Yup.InferType<ReturnType<typeof createWithdrawRequestSchema>>
