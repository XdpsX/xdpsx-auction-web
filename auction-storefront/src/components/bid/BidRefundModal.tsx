import { Button } from '@headlessui/react'
import Modal from '../ui/Modal'
import { BsExclamationTriangle } from 'react-icons/bs'
import { formatPrice } from '../../utils/format'

interface BidRefundModalProps {
  open: boolean
  onClose: () => void
  onSubmit: () => void
  amount: number
}

function BidRefundModal({
  open,
  onClose,
  onSubmit,
  amount,
}: BidRefundModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-2">
        <div className="h-16 w-16 bg-red-100 flex items-center justify-center rounded-full mx-auto mb-4">
          <BsExclamationTriangle className="text-red-500   h-8 w-8" />
        </div>
        <p className="mt-2 text-black text-lg mb-2">
          Do you want to accept the lost and refund 10% (
          <span className="text-blue-500 font-semibold">
            {formatPrice(amount)}
          </span>
          ) of the bid amount?
        </p>
        <div className="mt-6 flex items-center gap-4">
          <Button
            onClick={onSubmit}
            className="px-4 py-2 uppercase bg-red-500 text-white hover:bg-red-600"
          >
            Accept
          </Button>
          <Button
            onClick={onClose}
            className="px-4 py-2 uppercase bg-gray-700 text-white hover:bg-gray-600"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}
export default BidRefundModal
