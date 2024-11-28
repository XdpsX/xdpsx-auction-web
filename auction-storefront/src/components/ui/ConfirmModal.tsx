import Button from './Button'
import Modal from './Modal'
import { RiQuestionMark } from 'react-icons/ri'

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onSubmit: () => void
}

function ConfirmModal({ open, onClose, onSubmit }: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-2">
        <div className="h-16 w-16 bg-gray-100 flex items-center justify-center rounded-full mx-auto mb-4">
          <RiQuestionMark className=" h-8 w-8" />
        </div>
        <p className="mt-2 text-black text-lg mb-2">
          Do you want to continue with this action?
        </p>
        <div className="mt-6 flex items-center gap-4">
          <Button
            onClick={onSubmit}
            className="px-4 py-2 uppercase bg-blue-500 text-white hover:bg-blue-600"
          >
            Continue
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
export default ConfirmModal
