import React, { Key, useCallback } from 'react'
import { useEffect, useMemo } from 'react'

import useQueryParams from '~/app/hooks/useQueryParams'

import { publishedOptions, sortOptions } from '~/utils/data'

import AddButton from '~/components/AddButton'
import useAppDispatch from '~/app/hooks/useAppDispatch'
import useAppSelector from '~/app/hooks/useAppSelector'
import { fetchAllAuctions } from '~/app/features/auction'
import Search from '~/components/Search'
import Filter from '~/components/Filter'
import Sort from '~/components/Sort'
import FilterResult from '~/components/FilterResult'
import { DEFAULT_PUBLISHED, DEFAULT_SORT } from '~/constants'
import TableBottom from '~/components/TableBottom'
import AuctionTable from '~/components/AuctionTable'

function AuctionsList() {
  const dispatch = useAppDispatch()
  const {
    params: { pageNum, pageSize, keyword, published, sort },
    setParams,
    deleteAllParams
  } = useQueryParams()
  const { auctionPage, isLoading } = useAppSelector((state) => state.auction)
  const { userRole } = useAppSelector((state) => state.user)

  const filteredPublished = useMemo(() => publishedOptions.find((option) => option.key === published), [published])
  const filteredSort = useMemo(() => sortOptions.find((option) => option.key === sort), [sort])

  useEffect(() => {
    dispatch(
      fetchAllAuctions({
        pageNum: Number(pageNum),
        pageSize: Number(pageSize),
        keyword: keyword || null,
        published: published === 'all' ? null : published === 'true' ? true : false,
        sort: sort
      })
    )
  }, [dispatch, published, keyword, pageNum, pageSize, sort])

  const onClear = useCallback(() => {
    setParams({ keyword: '', pageNum: 1 })
  }, [setParams])

  const onPageChange = useCallback(
    (newPageNum: number) => {
      setParams({ pageNum: newPageNum })
    },
    [setParams]
  )

  const onPageSizeChange = useCallback(
    (newPageSize: number) => {
      setParams({ pageSize: newPageSize })
    },
    [setParams]
  )

  const onFilterChange = useCallback(
    (selectedValues: Record<string, string>) => {
      setParams({
        published: selectedValues['published'] === 'all' ? '' : String(selectedValues['published'])
      })
    },
    [setParams]
  )

  const onSortChange = useCallback(
    (value: Key) => {
      setParams({ sort: String(value) })
    },
    [setParams]
  )

  const onSearchChange = useCallback(
    (value: string) => {
      setParams({ keyword: value, pageNum: 1 })
    },
    [setParams]
  )

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
              items={[
                {
                  key: 'published',
                  label: 'Published/Unpublished',
                  allOptions: publishedOptions,
                  value: published
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
              onClear: () => setParams({ published: DEFAULT_PUBLISHED.key })
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

      <AuctionTable auctionPage={auctionPage} isLoading={isLoading} />

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
