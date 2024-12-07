import { AuctionInfo } from '../auction/type'
import { SellerInfo } from '../seller/type'

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

export type PaymentMethod = 'INTERNAL_WALLET' | 'VNPAY'

export type OrderDetails = {
  id: number
  trackNumber: string
  totalAmount: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  note: string | null
  reason: string | null
  createdAt: string
  updatedAt: string
  auction: AuctionInfo
  shippingInfo: ShippingInfo
  seller: SellerInfo
}
