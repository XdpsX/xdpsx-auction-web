import { useEffect } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'

function PaymentSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    navigate('/payment/handler', {
      replace: true,
      state: { params: searchParams.toString() },
    })
  }, [navigate, searchParams])
  return <Navigate to="/" />
}

export default PaymentSuccess
