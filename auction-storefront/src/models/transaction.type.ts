import * as yup from 'yup'

export type Transaction = {
  id: number
  type: 'DEPOSIT' | 'WITHDRAW'
  amount: number
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  paymentMethod: 'VNPAY' | 'MOMO'
  description: string
  createdAt: Date
  updatedAt: Date
}

export const depositSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError('Amount is required')
    .required('Amount is required')
    .min(50000, 'Amount must be greater than 50000'),
  paymentMethod: yup
    .string()
    .required('Payment method is required')
    .oneOf(['VNPAY', 'MOMO']),
})

export type DepositPayload = yup.InferType<typeof depositSchema>
