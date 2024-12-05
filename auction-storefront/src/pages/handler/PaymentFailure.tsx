import { Link, Navigate, useLocation } from 'react-router-dom'
import { BsXCircle } from 'react-icons/bs'

function PaymentFailure() {
  const { state } = useLocation()
  if (!state || !state.message) {
    return <Navigate to="/" replace />
  }
  return (
    <div className="flex flex-col items-center justify-center pt-32 gap-4 px-8 max-w-md mx-auto">
      <BsXCircle className="text-red-500 text-9xl" />
      <h1 className="font-bold text-2xl">Payment Failure</h1>
      <p className="text-gray-700 text-lg">{state.message}</p>
      <Link to="/" className="bg-blue-500 text-white px-4 py-1">
        Go back to home
      </Link>
    </div>
  )
}
export default PaymentFailure
