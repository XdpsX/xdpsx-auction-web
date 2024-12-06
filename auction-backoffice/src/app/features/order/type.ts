import { AuctionInfo } from '../auction/type'

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned'

export type ShippingInfo = {
  recipient: string
  mobileNumber: string
  shippingAddress: string
}

export type Order = {
  id: number
  trackNumber: string
  totalAmount: number
  status: OrderStatus
  updatedAt: string
  auction: AuctionInfo
  shippingInfo: ShippingInfo
}
