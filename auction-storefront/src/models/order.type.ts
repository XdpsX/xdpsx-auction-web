import { SellerInfo } from './seller.type'

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'

export type Order = {
  id: number
  trackNumber: string
  auctionName: string
  auctionImageUrl: string
  totalAmount: number
  shippingAddress: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  seller: SellerInfo
}
