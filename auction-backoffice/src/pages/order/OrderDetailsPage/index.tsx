import { Chip } from '@nextui-org/react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchOrderDetailsAsync } from '~/app/features/order'
import useAppDispatch from '~/app/hooks/useAppDispatch'
import useAppSelector from '~/app/hooks/useAppSelector'
import LoadingOverlay from '~/components/LoadingOverlay'
import { formatDateTime, formatPrice } from '~/utils/format'
import { capitalize } from '~/utils/helper'

function OrderDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { orderDetails, isLoading } = useAppSelector((state) => state.order)

  useEffect(() => {
    if (!id) return
    dispatch(fetchOrderDetailsAsync(+id))
      .unwrap()
      .catch(() => {
        navigate('/not-found')
      })
  }, [dispatch, id, navigate])

  if (isLoading) return <LoadingOverlay />
  if (!orderDetails) return null

  return (
    <section className='flex flex-col gap-12'>
      <div className='flex items-center justify-between gap-2'>
        <h1 className='page-heading'> Order Details</h1>
      </div>

      <div className='space-y-8 md:px-8 max-w-[1000px] '>
        <div className='flex gap-5 flex-col'>
          <div className='flex gap-5 justify-start items-center text-slate-600'>
            <div className='flex gap-2'>
              <div className='w-20'>
                <img
                  className='object-contain w-full h-full'
                  src={orderDetails.auction.mainImage}
                  alt='Auction Image'
                />
              </div>
              <div className='flex flex-col justify-start items-start'>
                <p className='text-xl font-bold'>{orderDetails.auction.name}</p>
                {orderDetails.auction.type === 'ENGLISH' ? (
                  <Chip className='bg-green-500/90 text-white'>{capitalize(orderDetails.auction.type)}</Chip>
                ) : (
                  <Chip color='warning' className='dark:text-white'>
                    {capitalize(orderDetails.auction.type)}
                  </Chip>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='md:grid md:grid-cols-4 gap-y-2 gap-x-3 items-center'>
          <span className='md:col-p-1 order-key'>Track number:</span>
          <p className=' md:col-span-3 mb-4 md:mb-0'>{orderDetails.trackNumber}</p>

          <span className='md:col-span-1 order-key'>Total Amount:</span>
          <p className='md:col-span-3 mb-4 md:mb-0'>{formatPrice(orderDetails.totalAmount)}</p>

          <span className='md:col-span-1 order-key'>Created At:</span>
          <p className='md:col-span-3 mb-4 md:mb-0'>{formatDateTime(orderDetails.createdAt)}</p>

          <span className='md:col-span-1 order-key'>Updated At:</span>
          <p className='md:col-span-3 mb-4 md:mb-0'>{formatDateTime(orderDetails.updatedAt)}</p>

          <span className='md:col-span-1 order-key'>Recipient:</span>
          <p className='md:col-span-3 mb-4 md:mb-0'>{orderDetails.shippingInfo.recipient}</p>

          <span className='md:col-span-1 order-key'>Shipping Info:</span>
          <p className='md:col-span-3 mb-4 md:mb-0'>
            {orderDetails.shippingInfo.mobileNumber} / {orderDetails.shippingInfo.shippingAddress}
          </p>

          <span className='md:col-span-1 order-key'>Status:</span>
          <p className='md:col-span-3 mb-4 md:mb-0 uppercase'>{orderDetails.status}</p>

          <span className='md:col-span-1 order-key'>Payment Method:</span>
          <p className='md:col-span-3 mb-4 md:mb-0 uppercase'>{orderDetails.paymentMethod}</p>

          {(orderDetails.status === 'Cancelled' || orderDetails.status === 'Returned') && (
            <>
              <span className='md:col-span-1 order-key'>Reason:</span>
              <p className='md:col-span-3 mb-4 md:mb-0 '>{orderDetails.reason}</p>
            </>
          )}

          {orderDetails.note && (
            <div className='col-span-4 '>
              <span className='order-key'>Note:</span>
              <div className='border mt-4 p-2'>
                <p>{orderDetails.note}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='flex justify-center'>
        <button onClick={() => navigate(-1)} className='bg-default-200 text-default-800 px-4 py-2 text-lg'>
          Back
        </button>
      </div>
    </section>
  )
}
export default OrderDetailsPage
