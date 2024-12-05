import { Key, useEffect, useMemo } from 'react'
import { fetchWithdrawalsAsync } from '~/app/features/withdrawal/slice'
import { WithdrawStatusParam } from '~/app/features/withdrawal/type'
import useAppDispatch from '~/app/hooks/useAppDispatch'
import useAppSelector from '~/app/hooks/useAppSelector'
import useQueryParams from '~/app/hooks/useQueryParams'
import Filter from '~/components/Filter'
import FilterResult from '~/components/FilterResult'
import Sort from '~/components/Sort'
import TableBottom from '~/components/Table/TableBottom'
import WithdrawalTable from '~/components/Table/WithdrawalTable'
import { DEFAULT_SORT } from '~/constants'
import { getWithdrawalStatus, withdrawalSortOptions } from '~/utils/data'

function WithdrawalList({ page }: { page: 'list' | 'request-list' }) {
  const dispatch = useAppDispatch()
  const { withdrawals, isLoading } = useAppSelector((state) => state.withdrawal)
  const {
    params: { pageNum, pageSize, sort, withdrawalStatuses: status },
    setParams,
    deleteAllParams
  } = useQueryParams()

  const withdrawStatuses = getWithdrawalStatus(page)

  const filteredSort = useMemo(() => withdrawalSortOptions.find((option) => option.key === sort), [sort])
  const filteredStatus = useMemo(
    () => withdrawStatuses.find((option) => option.key === status),
    [status, withdrawStatuses]
  )

  useEffect(() => {
    dispatch(
      fetchWithdrawalsAsync({
        page,
        pageNum: Number(pageNum),
        pageSize: Number(pageSize),
        sort: sort,
        status: status === 'all' ? null : (Number(status) as WithdrawStatusParam)
      })
    )
  }, [dispatch, page, pageNum, pageSize, sort, status])

  const onFilterChange = (selectedValues: Record<string, string>) => {
    console.log(selectedValues['status'])
    setParams({
      status: selectedValues['status']
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
                  key: 'status',
                  label: 'Status',
                  allOptions: withdrawStatuses,
                  value: status === 'all' ? withdrawStatuses[0].key : status
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
              key: filteredStatus?.key || withdrawStatuses[0].key,
              title: filteredStatus?.title || withdrawStatuses[0].title,
              exceptKey: withdrawStatuses[0].key,
              onClear: () => setParams({ status: withdrawStatuses[0].key })
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
