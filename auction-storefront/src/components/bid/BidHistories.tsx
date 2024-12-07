import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectUser } from '../../features/user/slice'
import BidHistoriesModal from './BidHistoriesModal'
import { classNames } from '../../utils/helper'
import {
  fetchAuctionBidHistoriesAsync,
  selectBid,
} from '../../features/bid/slice'

function BidHistories({ auctionId }: { auctionId: number }) {
  const dispatch = useAppDispatch()
  const { userProfile } = useAppSelector(selectUser)
  const [open, setOpen] = useState(false)
  const { bidHistories } = useAppSelector(selectBid)

  useEffect(() => {
    dispatch(
      fetchAuctionBidHistoriesAsync({ auctionId, pageNum: 1, pageSize: 5 })
    )
  }, [auctionId, dispatch])

  if (!bidHistories) return null

  if (bidHistories.items.length === 0) {
    return (
      <>
        <hr />
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Bid Histories</h2>

          <div className="p-4 bg-gray-100 rounded-md">
            <p className="text-lg text-center text-gray-500">
              No bid has been placed on this auction
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Danh sách chính */}
      <hr />
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Bid Histories</h2>
        <div className="overflow-x-auto max-w-lg">
          {/* Bảng lịch sử đấu giá */}
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
          {bidHistories.totalPages > 1 && (
            <div className="text-center mt-4">
              <button
                className="text-blue-500 font-semibold"
                onClick={() => setOpen(true)}
              >
                View more
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {open && (
        <BidHistoriesModal
          auctionId={auctionId}
          open={open}
          setOpen={setOpen}
        />
      )}
    </>
  )
}
export default BidHistories
