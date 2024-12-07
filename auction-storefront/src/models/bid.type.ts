import * as yup from 'yup'
import { AuctionInfo } from './auction.type'

export type Bid = {
  id: number
  amount: number
  auctionId: number
  bidderId: number
  status: 'ACTIVE' | 'WON' | 'LOST'
}

export const bidSchema = yup.object().shape({
  amount: yup
    .number()
    .required('Please enter bid amount')
    .typeError('Amount is required'),
})

export type BidPayload = yup.InferType<typeof bidSchema>

export type BidInfo = {
  id: number
  amount: number
  status: 'ACTIVE' | 'WON' | 'LOST'
  createdAt: string
  updatedAt: string
  canRefund: boolean
  auction: AuctionInfo
}

export type BidHistory = {
  id: number
  amount: number
  bidder: {
    id: number
    name: string
  }
  updatedAt: string
}
