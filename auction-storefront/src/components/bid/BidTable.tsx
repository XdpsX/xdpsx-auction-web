import PulseLoader from 'react-spinners/PulseLoader'
import useQueryParams from '../../hooks/useQueryParams'
import { BidInfo } from '../../models/bid.type'
import { Page } from '../../models/page.type'
import { pageNumOptions } from '../../utils/data'
import { formatDateTime, formatPrice, generateSlug } from '../../utils/format'
import Pagination from '../ui/Pagination'
import Select from '../ui/Select'
import cn from '../../utils/cn'
import AuctionType from '../auction/AuctionType'
import Button from '../ui/Button'
import { Link, useNavigate } from 'react-router-dom'
import ConfirmModal from '../ui/ConfirmModal'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  refundBidAsync,
  selectBid,
  setCurrentBidId,
} from '../../features/bid/slice'
import { toast } from 'react-toastify'
import { RiRefund2Fill } from 'react-icons/ri'
import { MdOutlinePayment } from 'react-icons/md'

function BidTable({
  bidPage,
  isLoading,
  status,
}: {
  bidPage: Page<BidInfo> | null
  isLoading: boolean
  status: string
}) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentBidId } = useAppSelector(selectBid)
  const { setParams } = useQueryParams()
  const [openModal, setOpenModal] = useState(false)

  const handleOpenModal = (bidId: number) => {
    dispatch(setCurrentBidId(bidId))
    setOpenModal(true)
  }

  const onPay = (bidId: number) => {
    navigate('/checkout', { state: { bidId: bidId } })
  }

  const onCancel = () => {
    if (!currentBidId) return

    dispatch(refundBidAsync(currentBidId))
      .unwrap()
      .then(() => {
        toast.success('Refund successfully')
        setOpenModal(false)
      })
  }

  const onPageChange = (pageNum: number) => {
    setParams({ pageNum: pageNum })
  }

  const onPageSizeChange = (pageSize: string) => {
    console.log(pageSize)
    setParams({ pageSize: pageSize, pageNum: '1', sort: null })
  }

  if (!bidPage) return null

  const { items, pageNum, pageSize, totalPages } = bidPage

  if (items.length === 0) {
    return <p className="text-center text-lg font-bold py-8">No bids found.</p>
  }

  const showAction = status !== 'LOST'

  return (
    <>
      <div className="flow-root space-y-6">
        <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:pl-8 relative">
            <table
              className={cn('min-w-full divide-y divide-gray-300', {
                'opacity-50': isLoading,
              })}
            >
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 px-3  text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-1 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Auction
                  </th>
                  {status === 'WON' ? (
                    <>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Security Fee
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Amount to Pay
                      </th>
                    </>
                  ) : (
                    <>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Bid Amount
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Security Fee
                      </th>
                    </>
                  )}
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Bid At
                  </th>
                  {showAction && (
                    <th
                      scope="col"
                      className="pl-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {item.id}
                    </td>
                    <td className=" whitespace-nowrap py-4 pl-4  font-medium text-gray-900 sm:pl-0">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12">
                          <img
                            src={item.auction.mainImage}
                            alt="Auction image"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="max-w-[220px]">
                          <p className="truncate">{item.auction.name}</p>
                          <AuctionType
                            type={item.auction.type}
                            className="p-1 text-[10px] inline-block"
                          />
                        </div>
                      </div>
                    </td>

                    {status === 'WON' ? (
                      <>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatPrice(item.amount / 10)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatPrice(item.amount * 0.9)}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatPrice(item.amount)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatPrice(item.amount / 10)}
                        </td>
                      </>
                    )}
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatDateTime(item.updatedAt)}
                    </td>

                    {showAction && (
                      <td className="whitespace-nowrap text-left py-4 pl-3  text-sm font-medium">
                        {status === 'WON' && (
                          <Button
                            title="Pay"
                            className="bg-blue-600 hover:bg-blue-700 py-1"
                            onClick={onPay.bind(null, item.id)}
                          >
                            <MdOutlinePayment size={20} />
                          </Button>
                        )}
                        {status === 'ACTIVE' && (
                          <div className="flex items-center gap-4">
                            <Link
                              to={`/auctions/${generateSlug({
                                name: item.auction.name,
                                id: item.auction.id,
                              })}`}
                              className="text-blue-500 underline hover:text-blue-400"
                            >
                              Go Auction
                            </Link>
                            {item.canRefund ? (
                              <Button
                                title="Refund"
                                className=" bg-red-600 hover:bg-red-700 py-1"
                                onClick={handleOpenModal.bind(null, item.id)}
                              >
                                <RiRefund2Fill size={20} />
                              </Button>
                            ) : (
                              <span className="bg-green-100 text-green-500 p-1">
                                Highest Bid
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {isLoading && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <PulseLoader color="#3b82f6" />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <Select
            label="Rows:"
            className="rounded-none border-b "
            selectKey={pageSize.toString()}
            options={pageNumOptions}
            onChange={onPageSizeChange}
          />
          {totalPages > 1 && (
            <Pagination
              pageNum={pageNum}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>
      <ConfirmModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={onCancel}
      />
    </>
  )
}
export default BidTable
