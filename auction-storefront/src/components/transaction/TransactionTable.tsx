import PulseLoader from 'react-spinners/PulseLoader'
import { Page } from '../../models/page.type'
import { Transaction } from '../../models/transaction.type'
import Pagination from '../ui/Pagination'
import Select from '../ui/Select'
import cn from '../../utils/cn'
import { formatDateTime, formatPrice } from '../../utils/format'
import useQueryParams from '../../hooks/useQueryParams'
import { pageNumOptions } from '../../utils/data'

function TransactionTable({
  transactionPage,
  isLoading,
}: {
  transactionPage: Page<Transaction> | null
  isLoading: boolean
}) {
  const { setParams } = useQueryParams()

  if (!transactionPage) return null

  const { items, pageNum, pageSize, totalPages } = transactionPage

  if (items.length === 0) {
    return (
      <p className="text-center py-12 font-bold text-xl">No orders found</p>
    )
  }

  const onPageChange = (pageNum: number) => {
    setParams({ pageNum: pageNum })
  }

  const onPageSizeChange = (pageSize: string) => {
    console.log(pageSize)
    setParams({ pageSize: pageSize, pageNum: '1', sort: null })
  }

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
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Id
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
                  Description
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Updated At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {item.id}
                  </td>
                  <td
                    className={`whitespace-nowrap px-3 py-4 text-sm ${
                      item.type === 'DEPOSIT'
                        ? 'text-green-500 '
                        : 'text-red-500 '
                    }`}
                  >
                    {item.type === 'DEPOSIT' ? '+' : '-'}
                    {formatPrice(item.amount)}
                  </td>
                  <td className="whitespace-wrap px-3 py-4 text-sm text-gray-500">
                    {item.description}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {formatDateTime(item.updatedAt)}
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
export default TransactionTable
