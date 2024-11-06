import React, { Key, useCallback } from 'react'
import { useEffect, useMemo } from 'react'
import {
  Chip,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip
} from '@nextui-org/react'
import { Icon } from '@iconify/react'

import useQueryParams from '~/app/hooks/useQueryParams'
import { Auction } from '~/app/features/auction/type'
import { publishedOptions, sortOptions } from '~/utils/data'
import { formatDateTime, formatPrice } from '~/utils/format'
import TableBottom from '~/components/TableBottom'
import AddButton from '~/components/AddButton'
import useAppDispatch from '~/app/hooks/useAppDispatch'
import useAppSelector from '~/app/hooks/useAppSelector'
import { fetchAllAuctions } from '~/app/features/auction'
import Search from '~/components/Search'
import Filter from '~/components/Filter'
import Sort from '~/components/Sort'
import FilterResult from '~/components/FilterResult'
import { DEFAULT_PUBLISHED, DEFAULT_SORT } from '~/constants'
import { Status } from '~/components/Status'
import { capitalize } from '~/utils/helper'
import { CopyText } from '~/components/CopyText'

const columns = [
  { name: 'ID', uid: 'id' },
  { name: 'IMAGE', uid: 'image' },
  { name: 'NAME', uid: 'name' },
  {
    name: 'PRICE',
    uid: 'price',
    info: (
      <div className='text-sm'>
        <p>
          <span className='font-semibold'>English:</span> starting bid amount
        </p>
        <p>
          <span className='font-semibold'>Sealead bid:</span> buy now amount
        </p>
      </div>
    )
  },
  { name: 'STATUS', uid: 'status' },
  { name: 'TYPE', uid: 'type' },
  { name: 'CATEGORY', uid: 'category' },
  { name: 'PUBLISHED', uid: 'published' },
  { name: 'ACTIONS', uid: 'actions' }
]

function AuctionsList() {
  const dispatch = useAppDispatch()
  const {
    params: { pageNum, pageSize, keyword, published, sort },
    setParams,
    deleteAllParams
  } = useQueryParams()
  const { auctionPage, isLoading } = useAppSelector((state) => state.auction)

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

  const renderCell = React.useCallback((auction: Auction, columnKey: Key) => {
    switch (columnKey) {
      case 'id':
        return <CopyText>{`${auction.id}`}</CopyText>
      case 'image':
        return (
          <img
            className='w-10 h-10 object-cover'
            src={auction.image || 'https://i.pravatar.cc/150?u=a042581f4e29026024d'}
          />
        )
      case 'name':
        return <p className='text-bold text-sm capitalize max-w-[140px] truncate'>{auction.name}</p>
      case 'price':
        return <p className='text-sm'>{formatPrice(auction.startingPrice)}</p>
      case 'published':
        return <Switch isSelected={auction.published} />
      case 'status': {
        const now = new Date()
        const content = (
          <div>
            <p>
              <span className='font-semibold'>Starting time:</span> {formatDateTime(auction.startingTime)}
            </p>
            <p>
              <span className='font-semibold'>Ending time:</span> {formatDateTime(auction.endingTime)}
            </p>
          </div>
        )
        if (now < new Date(auction.startingTime)) {
          return <Status status='Upcoming' content={content} />
        } else if (now < new Date(auction.endingTime)) {
          return <Status status='Live' content={content} />
        } else {
          return <Status status='Ended' content={content} />
        }
      }
      case 'type':
        return auction.auctionType === 'ENGLISH' ? (
          <Chip className='bg-green-500/90'>{capitalize(auction.auctionType)}</Chip>
        ) : (
          <Chip color='warning' className='dark:text-white'>
            {capitalize(auction.auctionType)}
          </Chip>
        )
      case 'category':
        return <p className='text-sm'>{auction.category}</p>
      case 'actions':
        return (
          <div className='relative flex items-center justify-center gap-2'>
            <Tooltip content='Details'>
              <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                <Icon icon='solar:eye-outline' height={18} width={18} />
              </span>
            </Tooltip>
            <Tooltip content='Edit user'>
              <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                <Icon icon='solar:pen-2-outline' height={18} width={18} />
              </span>
            </Tooltip>
            <Tooltip color='danger' content='Delete user'>
              <span className='text-lg text-danger cursor-pointer active:opacity-50'>
                <Icon icon='solar:trash-bin-minimalistic-outline' height={18} width={18} />
              </span>
            </Tooltip>
          </div>
        )
      default:
        return null
    }
  }, [])

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-2'>
        <h1 className='page-heading'>Auctions</h1>
        <AddButton />
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

      <Table aria-label='Auctions Table'>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' || column.uid === 'published' ? 'center' : 'start'}
            >
              {column.info ? (
                <div className='flex min-w-[108px] items-center gap-2'>
                  {column.name}
                  <Tooltip className='max-w-[40]' content={column.info}>
                    <Icon className='text-default-400' height={16} icon='solar:info-circle-linear' width={16} />
                  </Tooltip>
                </div>
              ) : (
                column.name
              )}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={auctionPage.items}
          emptyContent={<p>No item found</p>}
          isLoading={isLoading}
          loadingContent={<Spinner />}
        >
          {(item) => (
            <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
          )}
        </TableBody>
      </Table>

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
