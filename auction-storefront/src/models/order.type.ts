import { AuctionInfo } from './auction.type'
import * as yup from 'yup'
import { SellerInfo } from './seller.type'

export const createOrderSchema = yup.object().shape({
  bidId: yup.number().required('Bid ID is required'),
  recipient: yup
    .string()
    .required('Recipient is required')
    .max(50, 'Recipient must not exceed 50 characters'),
  mobileNumber: yup
    .string()
    .required('Mobile Number is required')
    .max(20, 'Mobile Number must not exceed 20 characters'),
  shippingAddress: yup
    .string()
    .required('Shipping address is required')
    .max(255, 'Shipping address must not exceed 255 characters'),
  note: yup.string().max(255, 'Note must not exceed 255 characters'),
  paymentMethod: yup.string().required('Payment method is required'),
})
export type CreateOrderPayload = yup.InferType<typeof createOrderSchema>

export type ShippingInfo = {
  recipient: string
  mobileNumber: string
  shippingAddress: string
}

export type OrderStatus =
  | 'Creating'
  | 'Pending'
  | 'Confirmed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'

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
