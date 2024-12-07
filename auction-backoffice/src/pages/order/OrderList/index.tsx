import { Key, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchOrdersAsync } from '~/app/features/order'
import { OrderStatus } from '~/app/features/order/type'
import useAppDispatch from '~/app/hooks/useAppDispatch'
import useAppSelector from '~/app/hooks/useAppSelector'
import useQueryParams from '~/app/hooks/useQueryParams'
import FilterResult from '~/components/FilterResult'
import Search from '~/components/Search'
import Sort from '~/components/Sort'
import OrderTable from '~/components/Table/OrderTable'
import TableBottom from '~/components/Table/TableBottom'
import { DEFAULT_SORT } from '~/constants'
import { orderSortOptions } from '~/utils/data'

function OrderList() {
  const { status } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {
    params: { pageNum, pageSize, keyword, published, sort },
    setParams,
    deleteAllParams
  } = useQueryParams()
  const { sellerOrder, isLoading } = useAppSelector((state) => state.order)
  const filteredSort = useMemo(() => orderSortOptions.find((option) => option.key === sort), [sort])

  useEffect(() => {
    dispatch(
      fetchOrdersAsync({
        pageNum: Number(pageNum),
        pageSize: Number(pageSize),
        keyword: keyword || null,
        sort: sort,
        status: (status as OrderStatus) || 'Pending'
      })
    )
      .unwrap()
      .catch(() => {
        navigate('/not-found')
      })
  }, [dispatch, published, keyword, pageNum, pageSize, sort, status, navigate])

  const onClear = () => {
    setParams({ keyword: '', pageNum: 1 })
  }

  const onPageChange = (newPageNum: number) => {
    setParams({ pageNum: newPageNum })
  }

  const onPageSizeChange = (newPageSize: number) => {
    setParams({ pageSize: newPageSize })
  }

  const onSortChange = (value: Key) => {
    setParams({ sort: String(value) })
  }

  const onSearchChange = (value: string) => {
    setParams({ keyword: value, pageNum: 1 })
  }

  if (!sellerOrder) return null

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-2'>
        <h1 className='page-heading'>{status} Orders</h1>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-6 '>
          <div>
            <Search value={keyword || ''} onClear={onClear} onSearch={onSearchChange} />
          </div>

          <div>
            <Sort sortOptions={orderSortOptions} onSortChange={onSortChange} />
          </div>
        </div>
        <FilterResult
          items={[
            {
              key: keyword || '',
              title: keyword ? `Search: ${keyword}` : '',
              exceptKey: '',
              onClear: () => setParams({ keyword: '' })
            },
            {
              key: filteredSort?.key || DEFAULT_SORT.key,
              title: filteredSort?.title || DEFAULT_SORT.title,
              exceptKey: DEFAULT_SORT.key,
              onClear: () => setParams({ sort: DEFAULT_SORT.key })
            }
          ]}
          onClearAll={deleteAllParams}
        />
      </div>

      <OrderTable orderPage={sellerOrder} isLoading={isLoading} status={status as OrderStatus} />

      {sellerOrder.items.length > 0 && (
        <TableBottom
          pageNum={+pageNum}
          pageSize={+pageSize}
          totalItems={sellerOrder.totalItems}
          totalPages={sellerOrder.totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          className='mt-4'
        />
      )}
    </section>
  )
}
export default OrderList
