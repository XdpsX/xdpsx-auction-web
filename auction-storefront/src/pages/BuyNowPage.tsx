import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
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

import { createOrderBuyNowAsync } from '../features/order/slice'
import {
  CreateOrderBuyNowPayload,
  createOrderBuyNowSchema,
} from '../models/order.type'
import { toast } from 'react-toastify'
import { selectWallet } from '../features/wallet/slice'
import {
  fetchBuyNowAuctionAsync,
  selectAuction,
} from '../features/auction/slice'

const paymentMethods: PaymentItemType[] = [
  { id: '0', title: 'My Wallet' },
  { id: '1', title: 'VNPAY', img: VNPAY_LOGO },
]

function BuyNowPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { wallet } = useAppSelector(selectWallet)
  const { buyAuction, isLoading } = useAppSelector(selectAuction)

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(createOrderBuyNowSchema),
    defaultValues: {
      recipient: '',
      mobileNumber: '',
      shippingAddress: '',
      note: '',
      paymentMethod: paymentMethods[0].id,
    },
  })

  useEffect(() => {
    if (!id) {
      navigate('/', { replace: true })
      return
    }

    dispatch(fetchBuyNowAuctionAsync(+id))
      .then()
      .catch((e) => {
        console.log(e)
        navigate('/', { replace: true })
      })
  }, [dispatch, id, navigate])

  const onChangePaymentMethod = (method: string) => {
    setValue('paymentMethod', method)
  }

  const onSubmit = async (data: CreateOrderBuyNowPayload) => {
    if (!wallet || !buyAuction) return

    if (data.paymentMethod === '0') {
      if (wallet.balance < buyAuction.startingPrice) {
        toast.error('Not enough balance')
        return
      }
      dispatch(
        createOrderBuyNowAsync({ auctionId: buyAuction.id, payload: data })
      )
        .unwrap()
        .then((order) => {
          navigate('/order/success', { replace: true, state: { order: order } })
        })
        .catch((err) => {
          if (err.fieldErrors) {
            Object.keys(err.fieldErrors).forEach((key) => {
              setError(key as keyof CreateOrderBuyNowPayload, {
                type: 'manual',
                message: err.fieldErrors[key],
              })
            })
          }
        })
    } else {
      // const paymentUrl = await createOrderPaymentLinkAPI(data)
      // window.location.replace(paymentUrl)
    }
  }

  if (isLoading) {
    return <LoadingOverlay />
  }
  if (!buyAuction) return null

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
                      src={buyAuction.mainImage}
                      alt="Auction image"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="max-w-[240px]">
                    <p className="truncate">{buyAuction.name}</p>
                    <AuctionType
                      type={buyAuction.type}
                      className="p-1 text-sm inline-block"
                    />
                  </div>
                </div>
                <span>{formatPrice(buyAuction.startingPrice)} </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping Fee</span>
                <span>{formatPrice(shippingFee)} </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total</span>
                <span className="text-lg font-bold text-green-500">
                  {formatPrice(buyAuction.startingPrice + shippingFee)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default BuyNowPage
