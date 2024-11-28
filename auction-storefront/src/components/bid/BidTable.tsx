import PulseLoader from 'react-spinners/PulseLoader'
import useQueryParams from '../../hooks/useQueryParams'
import { BidInfo } from '../../models/bid.type'
import { Page } from '../../models/page.type'
import { pageNumOptions } from '../../utils/data'
import { formatDateTime, formatPrice } from '../../utils/format'
import Pagination from '../ui/Pagination'
import Select from '../ui/Select'
import cn from '../../utils/cn'

function BidTable({
  bidPage,
  isLoading,
}: {
  bidPage: Page<BidInfo> | null
  isLoading: boolean
}) {
  const { setParams } = useQueryParams()

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

  return (
    <div className="flow-root space-y-6">
      <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 relative">
          <table
            className={cn('min-w-full divide-y divide-gray-300', {
              'opacity-50': isLoading,
            })}
          >
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  Auction
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Bid At
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    <div className="flex items-center gap-1">
                      <div className="w-12">
                        <img
                          src={item.auction.mainImage}
                          alt="Auction image"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {item.auction.name}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {formatPrice(item.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {formatDateTime(item.updatedAt)}
                  </td>

                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <a href="#" className="text-blue-600 hover:text-blue-900">
                      Edit
                    </a>
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
        {/* <Pagination pageNum={1} totalPages={10} onPageChange={onPageChange} /> */}
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
export default BidTable
