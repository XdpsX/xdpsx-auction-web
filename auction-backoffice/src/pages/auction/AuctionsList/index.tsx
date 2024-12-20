import React, { Key } from 'react'
import { useEffect, useMemo } from 'react'

import useQueryParams from '~/app/hooks/useQueryParams'

import {
  auctionStatusOptions,
  auctionTimeOptions,
  auctionTypeOptions,
  publishedOptions,
  sortOptions
} from '~/utils/data'

import AddButton from '~/components/AddButton'
import useAppDispatch from '~/app/hooks/useAppDispatch'
import useAppSelector from '~/app/hooks/useAppSelector'
import { fetchAllAuctions, fetchTrashedAuctionsAsync } from '~/app/features/auction'
import Search from '~/components/Search'
import Filter from '~/components/Filter'
import Sort from '~/components/Sort'
import FilterResult from '~/components/FilterResult'
import { DEFAULT_PUBLISHED, DEFAULT_SORT } from '~/constants'
import TableBottom from '~/components/Table/TableBottom'
import AuctionTable from '~/components/Table/AuctionTable'
import { AuctionStatus, AuctionTime, AuctionType } from '~/app/features/auction/type'

function AuctionsList({ page = 'list' }: { page?: 'list' | 'trashed' }) {
  const dispatch = useAppDispatch()
  const {
    params: {
      pageNum,
      pageSize,
      keyword,
      published,
      sort,
      auctionStatus: status,
      auctionType: type,
      auctionTime: time
    },
    setParams,
    deleteAllParams
  } = useQueryParams()
  const { auctionPage, isLoading } = useAppSelector((state) => state.auction)
  const { userRole } = useAppSelector((state) => state.user)

  const filteredPublished = useMemo(() => publishedOptions.find((option) => option.key === published), [published])
  const filteredSort = useMemo(() => sortOptions.find((option) => option.key === sort), [sort])
  const filteredStatus = useMemo(() => auctionStatusOptions.find((option) => option.key === status), [status])
  const filteredType = useMemo(() => auctionTypeOptions.find((option) => option.key === type), [type])
  const filteredTime = useMemo(() => auctionTimeOptions.find((option) => option.key === time), [time])

  useEffect(() => {
    if (page === 'list') {
      dispatch(
        fetchAllAuctions({
          pageNum: Number(pageNum),
          pageSize: Number(pageSize),
          keyword: keyword || null,
          published: published === 'all' ? null : published === 'true' ? true : false,
          sort: sort,
          status: status === 'all' ? null : (status as AuctionStatus),
          type: type === 'all' ? null : (type as AuctionType),
          time: time === 'all' ? null : (time as AuctionTime)
        })
      )
    }
    if (page === 'trashed') {
      dispatch(
        fetchTrashedAuctionsAsync({
          pageNum: Number(pageNum),
          pageSize: Number(pageSize),
          keyword: keyword || null,
          published: published === 'all' ? null : published === 'true' ? true : false,
          sort: sort,
          status: status === 'all' ? null : (status as AuctionStatus),
          type: type === 'all' ? null : (type as AuctionType),
          time: time === 'all' ? null : (time as AuctionTime)
        })
      )
    }
  }, [dispatch, published, keyword, pageNum, pageSize, sort, page, status, type, time])

  const onClear = () => {
    setParams({ keyword: '', pageNum: 1 })
  }

  const onPageChange = (newPageNum: number) => {
    setParams({ pageNum: newPageNum })
  }

  const onPageSizeChange = (newPageSize: number) => {
    setParams({ pageSize: newPageSize })
  }

  const onFilterChange = (selectedValues: Record<string, string>) => {
    setParams({
      pageNum: 1,
      published: selectedValues['published'] === 'all' ? '' : String(selectedValues['published']),
      status: selectedValues['status'] === 'all' ? '' : String(selectedValues['status']),
      type: selectedValues['type'] === 'all' ? '' : String(selectedValues['type']),
      time: selectedValues['time'] === 'all' ? '' : String(selectedValues['time'])
    })
  }

  const onSortChange = (value: Key) => {
    setParams({ sort: String(value) })
  }

  const onSearchChange = (value: string) => {
    setParams({ keyword: value, pageNum: 1 })
  }

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-2'>
        <h1 className='page-heading'>Auctions</h1>
        {userRole === 'SELLER' && <AddButton />}
      </div>

      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-6 '>
          <div>
            <Search value={keyword || ''} onClear={onClear} onSearch={onSearchChange} />
          </div>
          <div>
            <Filter
              userRole={userRole}
              items={[
                {
                  key: 'published',
                  label: 'Published/Unpublished',
                  allOptions: publishedOptions,
                  value: published,
                  exceptRole: 'SELLER'
                },
                {
                  key: 'type',
                  label: 'Type',
                  allOptions: auctionTypeOptions,
                  value: type
                },
                {
                  key: 'status',
                  label: 'Status',
                  allOptions: auctionStatusOptions,
                  value: status
                },
                {
                  key: 'time',
                  label: 'Time',
                  allOptions: auctionTimeOptions,
                  value: time
                }
              ]}
              onFilterChange={onFilterChange}
            />
          </div>
          <div>
            <Sort sortOptions={sortOptions} onSortChange={onSortChange} />
          </div>
        </div>
        <FilterResult
          userRole={userRole}
          items={[
            {
              key: keyword || '',
              title: keyword ? `Search: ${keyword}` : '',
              exceptKey: '',
              onClear: () => setParams({ keyword: '' })
            },
            {
              key: filteredPublished?.key || DEFAULT_PUBLISHED.key,
              title: filteredPublished?.title || DEFAULT_PUBLISHED.title,
              exceptKey: DEFAULT_PUBLISHED.key,
              onClear: () => setParams({ published: DEFAULT_PUBLISHED.key }),
              exceptRole: 'SELLER'
            },
            {
              key: filteredSort?.key || DEFAULT_SORT.key,
              title: filteredSort?.title || DEFAULT_SORT.title,
              exceptKey: DEFAULT_SORT.key,
              onClear: () => setParams({ sort: DEFAULT_SORT.key })
            },
            {
              key: filteredType?.key || 'all',
              title: filteredType?.title || 'All',
              exceptKey: 'all',
              onClear: () => setParams({ type: 'all' })
            },
            {
              key: filteredStatus?.key || 'all',
              title: filteredStatus?.title || 'All',
              exceptKey: 'all',
              onClear: () => setParams({ status: 'all' })
            },
            {
              key: filteredTime?.key || 'all',
              title: filteredTime?.title || 'All',
              exceptKey: 'all',
              onClear: () => setParams({ time: 'all' })
            }
          ]}
          onClearAll={deleteAllParams}
        />
      </div>

      <AuctionTable auctionPage={auctionPage} isLoading={isLoading} page={page} />

      {auctionPage.items.length > 0 && (
        <TableBottom
          pageNum={+pageNum}
          pageSize={+pageSize}
          totalItems={auctionPage.totalItems}
          totalPages={auctionPage.totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          className='mt-4'
        />
      )}
    </section>
  )
}
export default React.memo(AuctionsList)
