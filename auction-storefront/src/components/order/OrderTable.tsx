import PulseLoader from 'react-spinners/PulseLoader'
import { Order, OrderStatus } from '../../models/order.type'
import { Page } from '../../models/page.type'
import cn from '../../utils/cn'
import { formatDateTime, formatPrice } from '../../utils/format'
import Pagination from '../ui/Pagination'
import Select from '../ui/Select'
import useQueryParams from '../../hooks/useQueryParams'
import { pageNumOptions } from '../../utils/data'
import Button from '../ui/Button'

function OrderTable({
  orderPage,
  isLoading,
  status,
}: {
  orderPage: Page<Order> | null
  isLoading: boolean
  status: OrderStatus
}) {
  const { setParams } = useQueryParams()

  const onPageChange = (pageNum: number) => {
    setParams({ pageNum: pageNum })
  }

  const onPageSizeChange = (pageSize: string) => {
    console.log(pageSize)
    setParams({ pageSize: pageSize, pageNum: '1', sort: null })
  }

  if (!orderPage) return null

  const { items, pageNum, pageSize, totalPages } = orderPage

  return (
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
                  className="py-3.5 pl-4 pr-1 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  Auction
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Tracking Number
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Total Amount
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Shipping Address
                </th>

                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Updated At
                </th>
                <th
                  scope="col"
                  className="pl-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className=" whitespace-nowrap py-4 pl-4  font-medium text-gray-900 sm:pl-0">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12">
                        <img
                          src={item.auctionImageUrl}
                          alt="Auction image"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="max-w-[220px]">
                        <p className="truncate">{item.auctionName}</p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {item.trackNumber}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {formatPrice(item.totalAmount)}
                  </td>
                  <td className="whitespace-wrap px-3 py-4 text-sm text-gray-500">
                    {item.shippingAddress}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {formatDateTime(item.updatedAt)}
                  </td>

                  <td className="whitespace-nowrap text-left py-4 pl-3  text-sm font-medium">
                    {status === 'Pending' && (
                      <Button
                        className="bg-red-600 hover:bg-red-700"
                        // onClick={() =>
                        //   handleOpenModal('paid', item.id, item.amount * 0.9)
                        // }
                      >
                        Cancel
                      </Button>
                    )}
                    {/* {status === 'ACTIVE' && (
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
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() =>
                              handleOpenModal('refund', item.id, 0)
                            }
                          >
                            Refund
                          </Button>
                        ) : (
                          <span className="bg-green-100 text-green-500 p-1">
                            Highest Bid
                          </span>
                        )}
                      </div>
                    )} */}
                  </td>
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
  )
}
export default OrderTable
