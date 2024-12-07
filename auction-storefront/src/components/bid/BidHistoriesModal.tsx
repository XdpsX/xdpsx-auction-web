import { useEffect, useRef } from 'react'
import Modal from '../ui/Modal'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchAuctionBidHistoriesAsync,
  selectBid,
  setBidHistories,
} from '../../features/bid/slice'
import { classNames } from '../../utils/helper'
import { selectUser } from '../../features/user/slice'

function BidHistoriesModal({
  open,
  setOpen,
  auctionId,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  auctionId: number
}) {
  const dispatch = useAppDispatch()
  const { userProfile } = useAppSelector(selectUser)
  const modalContentRef = useRef<HTMLDivElement>(null)
  const { bidHistories, isBidHistoryLoading: isLoading } =
    useAppSelector(selectBid)

  useEffect(() => {
    dispatch(
      fetchAuctionBidHistoriesAsync({
        auctionId,
        pageNum: 1,
        pageSize: 5,
      })
    )

    return () => {
      dispatch(setBidHistories(null))
    }
  }, [auctionId, dispatch])

  const handleScroll = async () => {
    if (modalContentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = modalContentRef.current
      if (scrollTop + clientHeight + 4 >= scrollHeight && !isLoading) {
        if (!bidHistories) return
        if (bidHistories.pageNum < bidHistories.totalPages) {
          try {
            const nextPage = bidHistories.pageNum + 1
            dispatch(
              fetchAuctionBidHistoriesAsync({
                auctionId,
                pageNum: nextPage,
                pageSize: 5,
              })
            )
          } catch (error) {
            console.error('Failed to fetch next page:', error)
          }
        }
      }
    }
  }

  if (!bidHistories) return null

  return (
    <Modal open={open} onClose={() => setOpen(false)} modalClassName="max-w-lg">
      <div
        ref={modalContentRef}
        onScroll={handleScroll}
        className="overflow-y-auto max-h-[250px] p-4"
      >
        <h2 className="text-2xl font-semibold mb-2">Bid Histories</h2>
        <div className="overflow-x-auto ">
          <table className="w-full table-auto divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Bidder
                </th>
                <th className="hidden px-3 py-2 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                  Amount
                </th>
                <th className="hidden px-3 py-2 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {bidHistories.items.map((bid, idx) => (
                <tr key={bid.id}>
                  <td
                    className={classNames(
                      idx === 0 ? '' : 'border-t border-transparent',
                      'relative py-2 px-3 text-sm'
                    )}
                  >
                    <div className="font-medium text-gray-900">
                      {bid.bidder.name}
                      {bid.bidder.id === userProfile?.id ? (
                        <span className="ml-1 text-blue-600">(You)</span>
                      ) : null}
                    </div>
                    {idx !== 0 && (
                      <div className="absolute -top-px left-0 right-0 h-px bg-gray-200" />
                    )}
                  </td>
                  <td
                    className={classNames(
                      idx === 0 ? '' : 'border-t border-gray-200',
                      'hidden px-3 py-2 text-sm text-gray-500 lg:table-cell'
                    )}
                  >
                    {bid.amount}
                  </td>
                  <td
                    className={classNames(
                      idx === 0 ? '' : 'border-t border-gray-200',
                      'hidden px-3 py-2 text-sm text-gray-500 lg:table-cell'
                    )}
                  >
                    {bid.updatedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isLoading && <p className="text-center text-sm">Loading...</p>}
      </div>
    </Modal>
  )
}
export default BidHistoriesModal
