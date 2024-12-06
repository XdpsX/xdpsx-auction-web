import { useForm } from 'react-hook-form'
import Button from '../../components/ui/Button'
import PaymentSelect, {
  PaymentItemType,
} from '../../components/payment/PaymentSelect'
import { useAppSelector } from '../../store/hooks'
import { yupResolver } from '@hookform/resolvers/yup'
import { DepositPayload, depositSchema } from '../../models/transaction.type'
import { formatPrice } from '../../utils/format'
import Input from '../../components/ui/Input'
import { depositAPI } from '../../features/transaction/service'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../utils/error.helper'
import { selectWallet } from '../../features/wallet/slice'
import VNPAY_LOGO from '../../assets/vnpay-icon.png'
import MOMO_LOGO from '../../assets/momo-icon.svg'

const depositMethods: PaymentItemType[] = [
  { id: 'VNPAY', title: 'VNPay', img: VNPAY_LOGO },
  { id: 'MOMO', title: 'Momo', img: MOMO_LOGO },
]

function Deposit() {
  const { wallet } = useAppSelector(selectWallet)
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(depositSchema),
    defaultValues: {
      amount: 50_000,
    },
  })

  const onChangePaymentMethod = (method: string) => {
    setValue('paymentMethod', method)
  }

  const onSubmit = async (data: DepositPayload) => {
    try {
      const paymentUrl = await depositAPI(data)
      // window.location.replace(paymentUrl)
      window.open(paymentUrl, '_blank')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="rounded-sm bg-white border px-2 pb-10 shadow md:px-7 md:pb-20">
      <div className="border-b border-b-gray-200 py-6">
        <h1 className="text-lg font-medium capitalize text-gray-900">
          Deposit
        </h1>
        <div className="mt-1 text-sm text-gray-700">
          Deposit money to your wallet
        </div>
      </div>
      <form
        className="mt-8 flex flex-col-reverse md:flex-row md:items-start"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mt-6 flex-grow md:mt-0 md:pr-12">
          <div className="flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Wallet:
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <div className="pt-3 text-gray-700">
                {formatPrice(wallet?.balance || 0)}
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Amount:
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                classNameInput="w-full rounded-sm border border-gray-300 pr-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                name="amount"
                type="number"
                min={50_000}
                max={1_000_000_000}
                step={10_000}
                error={errors.amount}
                control={control}
              />
            </div>
          </div>
          <div className="mt-8 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right mb-2">
              Payment Method:
            </div>
            <div className="sm:w-[80%] sm:pl-5 -mt-1">
              <PaymentSelect
                paymentMethods={depositMethods}
                onChangePaymentMethod={onChangePaymentMethod}
              />
              {errors.paymentMethod && (
                <p className="text-sm text-red-500">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right" />
            <div className="sm:w-[80%] sm:pl-5">
              <Button className="bg-blue-500 min-w-20" type="submit">
                Deposit
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
export default Deposit
