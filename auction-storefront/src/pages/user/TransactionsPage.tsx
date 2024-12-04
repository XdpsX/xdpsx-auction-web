import { useEffect } from 'react'
import {
  fetchMyTransactionsAsync,
  selectTransaction,
} from '../../features/transaction/slice'
import useQueryParams from '../../hooks/useQueryParams'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { transactionSortOptions } from '../../utils/data'
import Select from '../../components/ui/Select'
import TransactionTable from '../../components/transaction/TransactionTable'

function TransactionsPage() {
  const dispatch = useAppDispatch()
  const {
    params: { pageNum, pageSize, sort, transactionType: type },
    setParams,
  } = useQueryParams()
  const { userTransactions, isLoading } = useAppSelector(selectTransaction)
  const filteredSort =
    transactionSortOptions.find((option) => option.key === sort) ||
    transactionSortOptions[0]

  useEffect(() => {
    dispatch(
      fetchMyTransactionsAsync({
        pageNum: Number(pageNum),
        pageSize: Number(pageSize),
        sort: sort,
        type: type === 'all' ? null : type,
      })
    )
  }, [dispatch, pageNum, pageSize, sort, type])

  const onSortChange = (key: string) => {
    setParams({ sort: key })
  }

  return (
    <div className="rounded-sm bg-white border px-2 pb-10 shadow md:px-7 md:pb-12 space-y-4">
      <div className="border-b border-b-gray-200 py-3">
        <h1 className="text-lg font-medium capitalize text-gray-900">
          Transactions
        </h1>
        <div className="mt-1 text-sm text-gray-700">
          History of your transactions
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="bg-gray-200 text-gray-800 rounded-lg px-2 py-1 font-semibold">
              {userTransactions?.totalItems || 0} items
            </span>
          </div>
          <Select
            className="border"
            selectKey={filteredSort.key}
            options={transactionSortOptions}
            onChange={onSortChange}
          />
        </div>
        <TransactionTable
          transactionPage={userTransactions}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
export default TransactionsPage
