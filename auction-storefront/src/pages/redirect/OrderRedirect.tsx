import { useNavigate, useSearchParams } from 'react-router-dom'
import { vnpayCodes } from '../../utils/data'
import LoadingOverlay from '../../components/ui/LoadingOverlay'
import { useEffect } from 'react'
import { createOrderExternalCallbackAPI } from '../../features/order/service'

function OrderRedirect() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const responseCode = searchParams.get('vnp_ResponseCode')
  const amount = searchParams.get('vnp_Amount')
  const code = vnpayCodes.find((code) => code.code === responseCode)

  useEffect(() => {
    if (!code) return
    if (code.status === 'success') {
      createOrderExternalCallbackAPI(searchParams.toString()).then((data) => {
        navigate('/order/success', {
          state: { order: data },
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
export default OrderRedirect
