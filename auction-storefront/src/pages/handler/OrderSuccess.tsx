import { Link, Navigate, useLocation } from 'react-router-dom'
import { BsCheck2Circle } from 'react-icons/bs'
import { formatDateTime, formatPrice } from '../../utils/format'
import { Order } from '../../models/order.type'

function OrderSuccess() {
  const { state } = useLocation()
  if (!state || !state.order) {
    return <Navigate to="/" replace />
  }

  const order = state.order as Order

  return (
    <div className="flex flex-col items-center justify-center pt-12 pb-16 gap-4 px-8 max-w-lg mx-auto">
      <BsCheck2Circle className="text-green-500 text-9xl" />
      <h1 className="font-bold text-2xl">Order Successful</h1>
      <div className="grid grid-cols-3 gap-y-2 text-lg">
        <span className="col-span-1">Auction:</span>
        <span className="col-span-2">
          <img
            src={order.auction.mainImage}
            alt="Auction image"
            className="w-16"
          />
          <span>{order.auction.name}</span>
        </span>

        <span className="col-span-1">Track number:</span>
        <span className="col-span-2">{order.trackNumber}</span>

        <span className="col-span-1">Total Amount:</span>
        <span className="col-span-2">{formatPrice(order.totalAmount)}</span>

        <span className="col-span-1">Created At:</span>
        <span className="col-span-2">{formatDateTime(order.updatedAt)}</span>

        <span className="col-span-1">Recipient:</span>
        <span className="col-span-2">{order.shippingInfo.recipient}</span>

        <span className="col-span-1">Address:</span>
        <span className="col-span-2">{order.shippingInfo.shippingAddress}</span>
      </div>
      <Link to="/" className="bg-blue-500 text-white px-4 py-1">
        Go back to home
      </Link>
    </div>
  )
}
export default OrderSuccess
