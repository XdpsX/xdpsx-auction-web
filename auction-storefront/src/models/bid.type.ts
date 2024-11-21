import * as yup from 'yup'

export type Bid = {
  id: number
  amount: number
  bidTime: string
  auctionId: number
  bidderId: number
}

export const bidSchema = yup.object().shape({
  amount: yup
    .number()
    .required('Please enter bid amount')
    .typeError('Amount is required'),
})

export type BidPayload = yup.InferType<typeof bidSchema>
