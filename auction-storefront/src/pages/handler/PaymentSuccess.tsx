import { Link, Navigate, useLocation } from 'react-router-dom'
import { BsCheck2Circle } from 'react-icons/bs'
import { formatPrice } from '../../utils/format'

function PaymentSuccess() {
  const { state } = useLocation()
  if (!state || !state.message || !state.amount) {
    return <Navigate to="/" replace />
  }
  return (
    <div className="flex flex-col items-center justify-center pt-12 pb-16 gap-4 px-8 max-w-md mx-auto">
      <BsCheck2Circle className="text-green-500 text-9xl" />
      <h1 className="font-bold text-2xl">Payment Successful</h1>
      <p className="text-gray-700 text-lg">{state.message}</p>
      <p className="text-gray-700 text-lg">
        Amount: {formatPrice(state.amount)}
      </p>
      <Link to="/" className="bg-blue-500 text-white px-4 py-1">
        Go back to home
      </Link>
    </div>
  )
}
export default PaymentSuccess
