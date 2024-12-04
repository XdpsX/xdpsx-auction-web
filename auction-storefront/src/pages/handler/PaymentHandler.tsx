import { useCallback, useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { depositCallbackAPI } from '../../features/transaction/service'
import { useAppDispatch } from '../../store/hooks'

import { toast } from 'react-toastify'
import { addBalance } from '../../features/wallet/slice'

function PaymentHandler() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = location.state?.params
  const dispatch = useAppDispatch()

  const handlePayment = useCallback(async () => {
    const transaction = await depositCallbackAPI(params)
    return transaction
  }, [params])

  useEffect(() => {
    const processPayment = async () => {
      const transaction = await handlePayment()
      if (transaction.status === 'COMPLETED') {
        dispatch(addBalance(transaction.amount))
        navigate('/wallet/deposit')
        toast.success('Deposit successfully')
      } else {
        navigate('/wallet/deposit')
        toast.error(transaction.description)
      }
    }

    processPayment()
  }, [dispatch, handlePayment, navigate])

  return <Navigate to="/" />
}
export default PaymentHandler
