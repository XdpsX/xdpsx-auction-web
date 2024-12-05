import { useNavigate, useSearchParams } from 'react-router-dom'
import { vnpayCodes } from '../../utils/data'
import { depositCallbackAPI } from '../../features/transaction/service'
import { useEffect } from 'react'
import LoadingOverlay from '../../components/ui/LoadingOverlay'

function PaymentRedirect() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const responseCode = searchParams.get('vnp_ResponseCode')
  const amount = searchParams.get('vnp_Amount')
  const code = vnpayCodes.find((code) => code.code === responseCode)

  useEffect(() => {
    if (!code) return
    if (code.status === 'success') {
      depositCallbackAPI(searchParams.toString()).then(() => {
        navigate('/payment/success', {
          state: { message: code.message, amount: Number(amount) / 100 },
        })
      })
    } else {
      navigate('/payment/failed', {
        state: { message: code.message },
      })
    }
  }, [amount, code, navigate, searchParams])

  return <LoadingOverlay />
}

export default PaymentRedirect
