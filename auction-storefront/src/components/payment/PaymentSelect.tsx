import { useState } from 'react'

export interface PaymentItemType {
  id: string
  title: string
  img?: string
}

function PaymentSelect({
  paymentMethods,
  onChangePaymentMethod,
  value,
}: {
  paymentMethods: PaymentItemType[]
  onChangePaymentMethod: (method: string) => void
  value?: string
}) {
  const [selectedOption, setSelectedOption] = useState(value || '')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value)
    onChangePaymentMethod(event.target.value)
  }

  return (
    <div className=" flex items-center gap-6">
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
          {payment.img ? (
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
          ) : (
            <label
              htmlFor={payment.id}
              className={`p-2 ml-3 block  ${
                payment.id === selectedOption
                  ? 'border-2 border-blue-500'
                  : 'border border-gray-500'
              } rounded-md cursor-pointer`}
            >
              {payment.title}
            </label>
          )}
        </div>
      ))}
    </div>
  )
}
export default PaymentSelect
