import { useEffect, useRef, useState } from 'react'
import Modal from '../ui/Modal'
import { useAppSelector } from '../../store/hooks'
import { classNames } from '../../utils/helper'
import { selectUser } from '../../features/user/slice'
import { BidHistory } from '../../models/bid.type'
import { Page } from '../../models/page.type'
import { fetchAuctionBidHistoriesAPI } from '../../features/bid/service'

function BidHistoriesModal({
  open,
  setOpen,
  auctionId,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  auctionId: number
}) {
  const { userProfile } = useAppSelector(selectUser)
  const modalContentRef = useRef<HTMLDivElement>(null)
  const [histories, setHistories] = useState<Page<BidHistory> | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetchAuctionBidHistoriesAPI(auctionId, 1, 5)
      .then((data) => {
        setHistories(data)
      })
      .catch((error) => {
        console.error('Failed to fetch bid histories:', error)
      })
    setIsLoading(false)

    return () => {
      setHistories(null)
    }
  }, [auctionId])

  const handleScroll = async () => {
    if (modalContentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = modalContentRef.current
      if (scrollTop + clientHeight + 4 >= scrollHeight && !isLoading) {
        if (!histories) return
        if (histories.pageNum < histories.totalPages) {
          setIsLoading(true)
          try {
            const nextPage = histories.pageNum + 1
            fetchAuctionBidHistoriesAPI(auctionId, nextPage, 5).then((data) => {
              setHistories({
                ...data,
                items: [...histories.items, ...data.items],
              })
            })
          } catch (error) {
            console.error('Failed to fetch next page:', error)
          }
          setIsLoading(false)
        }
      }
    }
  }

  if (!histories) return null

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
                <th className=" px-3 py-2 text-left text-sm font-semibold text-gray-900 ">
                  Amount
                </th>
                <th className=" px-3 py-2 text-left text-sm font-semibold text-gray-900 ">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {histories.items.map((bid, idx) => (
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
                      ' px-3 py-2 text-sm text-gray-500 '
                    )}
                  >
                    {bid.amount}
                  </td>
                  <td
                    className={classNames(
                      idx === 0 ? '' : 'border-t border-gray-200',
                      ' px-3 py-2 text-sm text-gray-500 '
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
