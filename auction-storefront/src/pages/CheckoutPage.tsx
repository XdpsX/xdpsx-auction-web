import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchMyWonBidAsync, selectBid } from '../features/bid/slice'

import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import LoadingOverlay from '../components/ui/LoadingOverlay'
import { formatPrice } from '../utils/format'
import AuctionType from '../components/auction/AuctionType'
import Input from '../components/ui/Input'
import PaymentSelect, {
  PaymentItemType,
} from '../components/payment/PaymentSelect'
import VNPAY_LOGO from '../assets/vnpay-icon.png'
import { ShippingInfoPayload, shippingInfoSchema } from '../models/order.type'
import { createOrderAsync } from '../features/order/slice'

const paymentMethods: PaymentItemType[] = [
  { id: '0', title: 'My Wallet' },
  { id: '1', title: 'VNPAY', img: VNPAY_LOGO },
]

function CheckoutPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { checkoutBid, isLoading } = useAppSelector(selectBid)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(shippingInfoSchema),
    defaultValues: {
      bidId: state.bidId,
      recipient: '',
      mobileNumber: '',
      shippingAddress: '',
      note: '',
      paymentMethod: paymentMethods[0].id,
    },
  })

  useEffect(() => {
    if (!state.bidId) {
      navigate('/', { replace: true })
      return
    }

    dispatch(fetchMyWonBidAsync(state.bidId))
      .then()
      .catch((e) => {
        console.log(e)
        navigate('/', { replace: true })
      })
  }, [dispatch, navigate, state.bidId])

  const onChangePaymentMethod = (method: string) => {
    setValue('paymentMethod', method)
  }

  const onSubmit = async (data: ShippingInfoPayload) => {
    dispatch(createOrderAsync(data))
      .unwrap()
      .then((order) => {
        navigate('/order/success', { replace: true, state: { order: order } })
      })
  }

  if (isLoading) {
    return <LoadingOverlay />
  }
  if (!checkoutBid) return null

  const securityFee = checkoutBid.amount * 0.1
  const shippingFee = 0

  return (
    <div className="w-[95%] xl:w-[75%] mx-auto py-16 space-y-20 gap-4">
      <div className="flex flex-col lg:flex-row space-y-4 md:space-y-0">
        <div className="lg:w-[60%] w-full ">
          <div className="flex flex-col gap-3">
            <div className="bg-white border p-6 shadow-sm rounded-md">
              <h2 className="text-slate-600 font-bold pb-3 text-xl">
                Shipping Information
              </h2>

              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex md:flex-row flex-col gap-2 w-full text-slate-600">
                  <div className="flex flex-col gap-1 lg:w-1/2">
                    <label htmlFor="recipient">Name:</label>
                    <Input
                      classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                      name="recipient"
                      error={errors.recipient}
                      control={control}
                    />
                  </div>
                </div>
                <div className="flex md:flex-row flex-col gap-2 w-full text-slate-600">
                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="mobileNumber">Mobile Phone:</label>
                    <Input
                      classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                      name="mobileNumber"
                      error={errors.mobileNumber}
                      control={control}
                    />
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="address">Address:</label>
                    <Input
                      classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                      name="shippingAddress"
                      error={errors.shippingAddress}
                      control={control}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="paymentMethod">Payment method:</label>
                  <Controller
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                      <PaymentSelect
                        paymentMethods={paymentMethods}
                        value={field.value}
                        onChangePaymentMethod={onChangePaymentMethod}
                      />
                    )}
                  />
                  {errors.paymentMethod && (
                    <p className="text-red-500">
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="note">Note:</label>
                  <Controller
                    name="note"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        className="w-full px-3 min-h-40 py-2 border border-gray-300 outline-none focus:border-gray-500 rounded-sm"
                        id="note"
                        {...field}
                      ></textarea>
                    )}
                  />
                  {errors.note && (
                    <p className="text-red-500">{errors.note.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-[6px] rounded-sm hover:shadow-yellow-500/50 hover:shadow-lg bg-yellow-500 text-sm text-white uppercase"
                >
                  Pay
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:w-[40%] w-full ">
          <div className="md:pl-3 pl-0">
            <div className="bg-white border p-3 text-slate-600 flex flex-col gap-3">
              <h2 className="text-xl font-bold">Order Information</h2>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16">
                    <img
                      src={checkoutBid.auction.mainImage}
                      alt="Auction image"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="max-w-[240px]">
                    <p className="truncate">{checkoutBid.auction.name}</p>
                    <AuctionType
                      type={checkoutBid.auction.type}
                      className="p-1 text-sm inline-block"
                    />
                  </div>
                </div>
                <span>{formatPrice(checkoutBid.amount)} </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Pre-Payment</span>
                <span>{formatPrice(securityFee)} </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping Fee</span>
                <span>{formatPrice(shippingFee)} </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total</span>
                <span className="text-lg font-bold text-green-500">
                  {formatPrice(checkoutBid.amount + shippingFee - securityFee)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CheckoutPage
