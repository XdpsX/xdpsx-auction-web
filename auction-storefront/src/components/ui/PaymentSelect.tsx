import VNPAY_LOGO from '../../assets/vnpay-icon.png'
import MOMO_LOGO from '../../assets/momo-icon.svg'
import { useState } from 'react'

const paymentMethods = [
  { id: 'VNPAY', title: 'VNPay', img: VNPAY_LOGO },
  { id: 'MOMO', title: 'Momo', img: MOMO_LOGO },
]

function PaymentSelect({
  onChangePaymentMethod,
}: {
  onChangePaymentMethod: (method: string) => void
}) {
  const [selectedOption, setSelectedOption] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value)
    onChangePaymentMethod(event.target.value)
  }

  return (
    <div className="space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
      {paymentMethods.map((payment) => (
        <div key={payment.id} className="flex items-center">
          <input
            value={payment.id}
            checked={selectedOption === payment.id}
            onChange={handleChange}
            id={payment.id}
            name="payment-method"
            type="radio"
            className="h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <label
            htmlFor={payment.id}
            className={`w-16 h-16 p-2 ml-3 block  ${
              payment.id === selectedOption
                ? 'border-2 border-blue-500'
                : 'border border-gray-500'
            } rounded-md cursor-pointer`}
          >
            <img
              src={payment.img}
              alt="Payment logo"
              className="w-full object-cover"
            />
          </label>
        </div>
      ))}
    </div>
  )
}
export default PaymentSelect
