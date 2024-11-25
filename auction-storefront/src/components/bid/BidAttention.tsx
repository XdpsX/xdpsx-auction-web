import Button from '../ui/Button'
import Modal from '../ui/Modal'

interface BidAttentionProps {
  open: boolean
  onClose: () => void
  showAttentionAgain: boolean
  setShowAttentionAgain: (value: boolean) => void
  onSubmit: () => void
}

const BidAttention: React.FC<BidAttentionProps> = ({
  open,
  onClose,
  showAttentionAgain,
  setShowAttentionAgain,
  onSubmit,
}) => {
  return (
    <Modal open={open} onClose={onClose} title="Attention">
      <p className="mt-2 text-black text-lg mb-2">
        Bidding requires a deposit of 10%.
      </p>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="show-bid-attention"
          checked={!showAttentionAgain}
          onChange={() => setShowAttentionAgain(!showAttentionAgain)}
        />
        <label htmlFor="show-bid-attention" className="text-black">
          Do not show this message again
        </label>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <Button
          onClick={onSubmit}
          className="px-4 py-2 uppercase bg-blue-500 text-white hover:bg-blue-600"
        >
          Bid
        </Button>
        <Button
          onClick={onClose}
          className="px-4 py-2 uppercase bg-gray-700 text-white hover:bg-gray-600"
        >
          Close
        </Button>
      </div>
    </Modal>
  )
}

export default BidAttention
