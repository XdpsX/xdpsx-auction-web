import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useEffect } from 'react'
import { fetchOrderDetailsAsync, selectOrder } from '../../features/order/slice'
import LoadingOverlay from '../../components/ui/LoadingOverlay'
import { formatDateTime, formatPrice } from '../../utils/format'
import AuctionType from '../../components/auction/AuctionType'

function OrderDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { orderDetails, isLoading } = useAppSelector(selectOrder)

  useEffect(() => {
    if (!id) return
    dispatch(fetchOrderDetailsAsync(+id))
      .unwrap()
      .catch(() => {
        navigate('/not-found', { replace: true })
      })
  }, [dispatch, id, navigate])

  if (isLoading) return <LoadingOverlay />
  if (!orderDetails) return null

  return (
    <div className="rounded-sm bg-white border px-2 pb-10 shadow md:px-7 md:pb-12 space-y-4">
      <div className="border-b border-b-gray-200 py-3">
        <h1 className="text-lg font-medium capitalize text-gray-900">
          Order Details
        </h1>
        <div className="mt-1 text-sm text-gray-700">
          Order details and shipping information
        </div>
      </div>

      <div className="space-y-6 px-2">
        <div className="flex gap-5 flex-col">
          <div className="flex gap-5 justify-start items-center text-slate-600">
            <div className="flex gap-2">
              <div className="w-20">
                <img
                  className="object-contain w-full h-full"
                  src={orderDetails.auction.mainImage}
                  alt="Product Image"
                />
              </div>
              <div className="flex flex-col justify-start items-start">
                <p className="text-xl font-bold">{orderDetails.auction.name}</p>
                <AuctionType
                  type={orderDetails.auction.type}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-y-2 gap-x-3 items-center">
          <span className="col-span-1 order-key">Track number:</span>
          <span className="col-span-3">{orderDetails.trackNumber}</span>

          <span className="col-span-1 order-key">Total Amount:</span>
          <span className="col-span-3">
            {formatPrice(orderDetails.totalAmount)}
          </span>

          <span className="col-span-1 order-key">Created At:</span>
          <span className="col-span-3">
            {formatDateTime(orderDetails.createdAt)}
          </span>

          <span className="col-span-1 order-key">Updated At:</span>
          <span className="col-span-3">
            {formatDateTime(orderDetails.updatedAt)}
          </span>

          <span className="col-span-1 order-key">Recipient:</span>
          <span className="col-span-3">
            {orderDetails.shippingInfo.recipient}
          </span>

          <span className="col-span-1 order-key">Shipping Info:</span>
          <span className="col-span-3">
            {orderDetails.shippingInfo.mobileNumber} /{' '}
            {orderDetails.shippingInfo.shippingAddress}
          </span>

          <span className="col-span-1 order-key">Status:</span>
          <span className="col-span-3 uppercase">{orderDetails.status}</span>

          <span className="col-span-1 order-key">Payment Method:</span>
          <span className="col-span-3 uppercase">
            {orderDetails.paymentMethod}
          </span>

          {(orderDetails.status === 'Cancelled' ||
            orderDetails.status === 'Returned') && (
            <>
              <span className="col-span-1 order-key">Reason:</span>
              <span className="col-span-3 ">{orderDetails.reason}</span>
            </>
          )}

          {orderDetails.note && (
            <div className="col-span-4 ">
              <span className="order-key">Note:</span>
              <div className="border mt-4 p-2">
                <p>{orderDetails.note}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 text-gray-800 px-4 py-2 text-lg"
        >
          Back
        </button>
      </div>
    </div>
  )
}
export default OrderDetailsPage
