import { Key, useEffect, useMemo } from 'react'
import { fetchWithdrawalsAsync } from '~/app/features/withdrawal/slice'
import useAppDispatch from '~/app/hooks/useAppDispatch'
import useAppSelector from '~/app/hooks/useAppSelector'
import useQueryParams from '~/app/hooks/useQueryParams'
import Filter from '~/components/Filter'
import FilterResult from '~/components/FilterResult'
import Sort from '~/components/Sort'
import TableBottom from '~/components/Table/TableBottom'
import WithdrawalTable from '~/components/Table/WithdrawalTable'
import { DEFAULT_SORT } from '~/constants'
import { withdrawalListStatus, withdrawalRequestStatus, withdrawalSortOptions } from '~/utils/data'

function WithdrawalList({ page }: { page: 'list' | 'request-list' }) {
  const dispatch = useAppDispatch()
  const { withdrawals, isLoading } = useAppSelector((state) => state.withdrawal)
  const {
    params: { pageNum, pageSize, sort, withdrawalStatuses: statuses },
    setParams,
    deleteAllParams
  } = useQueryParams()
  const filteredSort = useMemo(() => withdrawalSortOptions.find((option) => option.key === sort), [sort])
  const filteredStatus = useMemo(() => {
    const status = page === 'list' ? withdrawalListStatus : withdrawalRequestStatus
    return status.find((option) => option.key === statuses)
  }, [page, statuses])

  useEffect(() => {
    dispatch(
      fetchWithdrawalsAsync({
        pageNum: Number(pageNum),
        pageSize: Number(pageSize),
        sort: sort,
        statuses:
          statuses === 'all'
            ? page === 'list'
              ? withdrawalListStatus[0].key
              : withdrawalRequestStatus[0].key
            : statuses
      })
    )
  }, [dispatch, pageNum, pageSize, sort, statuses, page])

  const onFilterChange = (selectedValues: Record<string, string>) => {
    console.log(selectedValues['statuses'])
    setParams({
      statuses: selectedValues['statuses']
    })
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

  if (!withdrawals) return null

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-2'>
        <h1 className='page-heading'>Withdrawals</h1>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-6'>
          <div>
            <Filter
              items={[
                {
                  key: 'statuses',
                  label: 'Status',
                  allOptions: page === 'list' ? withdrawalListStatus : withdrawalRequestStatus,
                  value:
                    statuses === 'all'
                      ? page === 'list'
                        ? withdrawalListStatus[0].key
                        : withdrawalRequestStatus[0].key
                      : statuses
                }
              ]}
              onFilterChange={onFilterChange}
            />
          </div>
          <div>
            <Sort sortOptions={withdrawalSortOptions} onSortChange={onSortChange} />
          </div>
        </div>
        <FilterResult
          items={[
            {
              key:
                filteredStatus?.key || (page === 'list' ? withdrawalListStatus[0].key : withdrawalRequestStatus[0].key),
              title:
                filteredStatus?.title ||
                (page === 'list' ? withdrawalListStatus[0].title : withdrawalRequestStatus[0].title),
              exceptKey: page === 'list' ? withdrawalListStatus[0].key : withdrawalRequestStatus[0].key,
              onClear: () =>
                setParams({ statuses: page === 'list' ? withdrawalListStatus[0].key : withdrawalRequestStatus[0].key })
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

      <WithdrawalTable withdrawalPage={withdrawals} isLoading={isLoading} />

      {withdrawals.items.length > 0 && (
        <TableBottom
          pageNum={+pageNum}
          pageSize={+pageSize}
          totalItems={withdrawals.totalItems}
          totalPages={withdrawals.totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          className='mt-4'
        />
      )}
    </section>
  )
}
export default WithdrawalList
