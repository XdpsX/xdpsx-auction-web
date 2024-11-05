import React, { Key } from 'react'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
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
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { fetchAllAuctions } from '~/features/auction.slice'
import useQueryParams from '~/hooks/useQueryParams'
import { Auction } from '~/types/auction'
import { publishedOptions, sortOptions } from '~/utils/data'
import { createUrlWithParams } from '~/utils/helper'
import { formatDateTime, formatPrice } from '~/utils/format'
import TableBottom from '~/components/shared/TableBottom'
import AddButton from '~/components/shared/AddButton'
import TableFilter from '~/components/shared/TableFilter'

const columns = [
  { name: 'ID', uid: 'id' },
  { name: 'IMAGE', uid: 'image' },
  { name: 'NAME', uid: 'name' },
  { name: 'PRICE', uid: 'price' },
  { name: 'STARTING', uid: 'starting' },
  { name: 'ENDING', uid: 'ending' },
  { name: 'TYPE', uid: 'type' },
  { name: 'PUBLISHED', uid: 'published' },
  { name: 'CATEGORY', uid: 'category' },
  { name: 'ACTIONS', uid: 'actions' }
]

function Auctions() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const params = useQueryParams()
  const { pageNum, pageSize, keyword, sort, hasPublished } = useMemo(() => params, [params])
  const { auctionPage, isLoading } = useAppSelector((state) => state.auction)

  const filteredPublished = publishedOptions.find((option) => option.key === hasPublished)
  const filteredSort = sortOptions.find((option) => option.key === sort)

  useEffect(() => {
    dispatch(
      fetchAllAuctions({
        pageNum: Number(pageNum),
        pageSize: Number(pageSize),
        keyword: keyword || null,
        hasPublished: hasPublished ? (hasPublished === 'true' ? true : false) : null,
        sort: sort
      })
    )
  }, [dispatch, hasPublished, keyword, pageNum, pageSize, sort])

  const onClear = React.useCallback(() => {
    navigate(createUrlWithParams(params, { keyword: '', pageNum: 1 }))
  }, [navigate, params])

  const onPageChange = React.useCallback(
    (newPageNum: number) => {
      navigate(createUrlWithParams(params, { pageNum: newPageNum }))
    },
    [navigate, params]
  )

  const onPageSizeChange = React.useCallback(
    (newPageSize: number) => {
      navigate(createUrlWithParams(params, { pageSize: newPageSize }))
    },
    [navigate, params]
  )

  const onPublishedChange = React.useCallback(
    (value: string) => {
      navigate(createUrlWithParams(params, { hasPublished: value === 'all' ? null : String(value) }))
    },
    [navigate, params]
  )

  const onSortChange = React.useCallback(
    (value: Key) => {
      navigate(createUrlWithParams(params, { sort: String(value) }))
    },
    [navigate, params]
  )

  const onSearchChange = React.useCallback(
    (value: string) => {
      navigate(createUrlWithParams(params, { keyword: value, pageNum: 1 }))
    },
    [navigate, params]
  )

  const renderCell = React.useCallback((auction: Auction, columnKey: Key) => {
    switch (columnKey) {
      case 'id':
        return <p className='text-sm'>{auction.id}</p>
      case 'image':
        return (
          <img
            className='w-10 h-10 object-cover'
            src={auction.image || 'https://i.pravatar.cc/150?u=a042581f4e29026024d'}
          />
        )
      case 'name':
        return <p className='text-bold text-sm capitalize'>{auction.name}</p>
      case 'price':
        return <p className='text-sm'>{formatPrice(auction.startingPrice)}</p>
      case 'published':
        return <Switch isSelected={auction.published} />
      case 'starting':
        return <p className='text-sm'>{formatDateTime(auction.startingTime)}</p>
      case 'ending':
        return <p className='text-sm'>{formatDateTime(auction.endingTime)}</p>
      case 'type':
        return <p className='text-sm'>{auction.auctionType}</p>
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
      <TableFilter
        keyword={keyword ?? ''}
        filteredPublished={filteredPublished}
        filteredSort={filteredSort}
        onClear={onClear}
        onSearchChange={onSearchChange}
        onPublishedChange={onPublishedChange}
        onSortChange={onSortChange}
      />

      <Table aria-label='Auctions Table'>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
              {column.name}
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
export default Auctions
