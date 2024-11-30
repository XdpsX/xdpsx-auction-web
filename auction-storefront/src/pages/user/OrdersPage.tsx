import { useEffect } from 'react'
import { fetchMyOrdersAsync, selectOrder } from '../../features/order/slice'
import useQueryParams from '../../hooks/useQueryParams'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { orderSortOptions } from '../../utils/data'
import { OrderStatus } from '../../models/order.type'
import Select from '../../components/ui/Select'
import OrderTable from '../../components/order/OrderTable'
import Search from '../../components/ui/Search'

function OrdersPage() {
  const dispatch = useAppDispatch()
  const {
    params: { pageNum, pageSize, sort, orderStatus: status, keyword },
    setParams,
  } = useQueryParams()
  const { userOrder, isLoading } = useAppSelector(selectOrder)
  const filteredSort =
    orderSortOptions.find((option) => option.key === sort) ||
    orderSortOptions[0]

  useEffect(() => {
    dispatch(
      fetchMyOrdersAsync({
        pageNum: Number(pageNum),
        pageSize: Number(pageSize),
        keyword: keyword,
        sort: sort,
        status: status as OrderStatus,
      })
    )
  }, [dispatch, keyword, pageNum, pageSize, sort, status])

  const onSortChange = (key: string) => {
    setParams({ sort: key })
  }

  const onSearch = (keyword: string) => {
    setParams({ keyword: keyword, pageNum: '1' })
  }

  const onClear = () => {
    setParams({ keyword: null, pageNum: '1' })
  }

  return (
    <div className="rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-12 space-y-4">
      <div className="border-b border-b-gray-200 py-3">
        <h1 className="text-lg font-medium capitalize text-gray-900">
          {status} Orders
        </h1>
        <div className="mt-1 text-sm text-gray-700">
          Manage your {status.toLowerCase()} orders
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="bg-gray-200 text-gray-800 rounded-lg px-2 py-1 font-semibold">
              {userOrder?.totalItems || 0} items
            </span>
            <Search
              keyword={keyword || ''}
              placeholder="Enter tracking number..."
              onSubmit={onSearch}
              onClear={onClear}
            />
          </div>
          <Select
            className="border"
            selectKey={filteredSort.key}
            options={orderSortOptions}
            onChange={onSortChange}
          />
        </div>
        <OrderTable
          orderPage={userOrder}
          isLoading={isLoading}
          status={status as OrderStatus}
        />
      </div>
    </div>
  )
}
export default OrdersPage
