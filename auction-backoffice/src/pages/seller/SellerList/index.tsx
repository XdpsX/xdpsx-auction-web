import { Key, useEffect, useMemo } from 'react'
import { fetchSellerRegistersAsync, fetchSellersAsync } from '~/app/features/seller'
import useAppDispatch from '~/app/hooks/useAppDispatch'
import useAppSelector from '~/app/hooks/useAppSelector'
import useQueryParams from '~/app/hooks/useQueryParams'
import Filter from '~/components/Filter'
import FilterResult from '~/components/FilterResult'
import Search from '~/components/Search'
import Sort from '~/components/Sort'
import SellerTable from '~/components/Table/SellerTable'
import TableBottom from '~/components/Table/TableBottom'
import { DEFAULT_SORT } from '~/constants'
import { sellerStatus, sortOptions } from '~/utils/data'

function SellerList({ page = 'list' }: { page?: 'list' | 'register-list' }) {
  const dispatch = useAppDispatch()
  const {
    params: { pageNum, pageSize, keyword, sort, sellerStatus: status },
    setParams,
    deleteAllParams
  } = useQueryParams()
  const { sellerPage, isLoading } = useAppSelector((state) => state.seller)

  const filteredStatus = useMemo(() => sellerStatus.find((option) => option.key === status), [status])
  const filteredSort = useMemo(() => sortOptions.find((option) => option.key === sort), [sort])

  useEffect(() => {
    if (page == 'list') {
      dispatch(
        fetchSellersAsync({
          pageNum: Number(pageNum),
          pageSize: Number(pageSize),
          keyword: keyword || null,
          status: status === 'all' ? null : status,
          sort: sort
        })
      )
    } else {
      dispatch(
        fetchSellerRegistersAsync({
          pageNum: Number(pageNum),
          pageSize: Number(pageSize),
          keyword: keyword || null,
          sort: sort
        })
      )
    }
  }, [dispatch, keyword, page, pageNum, pageSize, sort, status])

  const onFilterChange = (selectedValues: Record<string, string>) => {
    setParams({
      sellerStatus: selectedValues['status'] === 'all' ? '' : String(selectedValues['status'])
    })
  }

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

  if (!sellerPage) return null

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-2'>
        <h1 className='page-heading'>{page === 'list' ? 'Sellers' : 'Seller Registrations'}</h1>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-6 '>
          <div>
            <Search value={keyword || ''} onClear={onClear} onSearch={onSearchChange} />
          </div>
          {page === 'list' && (
            <div>
              <Filter
                items={[
                  {
                    key: 'status',
                    label: 'Status',
                    allOptions: sellerStatus,
                    value: status
                  }
                ]}
                onFilterChange={onFilterChange}
              />
            </div>
          )}
          <div>
            <Sort sortOptions={sortOptions} onSortChange={onSortChange} />
          </div>
        </div>
        {page === 'list' && (
          <FilterResult
            items={[
              {
                key: keyword || '',
                title: keyword ? `Search: ${keyword}` : '',
                exceptKey: '',
                onClear: () => setParams({ keyword: '' })
              },
              {
                key: filteredStatus?.key || 'all',
                title: filteredStatus?.title || 'All',
                exceptKey: 'all',
                onClear: () => setParams({ sellerStatus: 'all' })
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
        )}
      </div>

      <SellerTable sellerPage={sellerPage} isLoading={isLoading} page={page} />

      {sellerPage.items.length > 0 && (
        <TableBottom
          pageNum={+pageNum}
          pageSize={+pageSize}
          totalItems={sellerPage.totalItems}
          totalPages={sellerPage.totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          className='mt-4'
        />
      )}
    </section>
  )
}
export default SellerList
