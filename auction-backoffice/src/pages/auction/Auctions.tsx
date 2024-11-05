import React, { Key } from 'react'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
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
import { publishedOptions } from '~/utils/data'
import { capitalize, createUrlWithParams } from '~/utils/helper'
import { formatDateTime, formatPrice } from '~/utils/format'

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

const sortOptions = [
  { name: 'Name A-Z', uid: 'name' },
  { name: 'Name Z-A', uid: '-name' },
  { name: 'Oldest', uid: 'date' },
  { name: 'Newest', uid: '-date' }
]

function Auctions() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const params = useQueryParams()
  const { pageNum, pageSize, keyword, sort, hasPublished } = useMemo(() => params, [params])
  const { auctionPage } = useAppSelector((state) => state.auction)

  const filteredPublished = publishedOptions.find((option) => option.uid === hasPublished)
  const filteredSort = sortOptions.find((option) => option.uid === sort)

  useEffect(() => {
    dispatch(
      fetchAllAuctions({
        pageNum: Number(pageNum),
        pageSize: Number(pageSize),
        keyword: keyword || null,
        hasPublished: hasPublished ? (hasPublished === 'true' ? true : false) : null,
        sort: sort || null
      })
    )
  }, [dispatch, hasPublished, keyword, pageNum, pageSize, sort])

  const onClear = React.useCallback(() => {
    navigate(createUrlWithParams(params, { keyword: '', pageNum: 1 }))
  }, [navigate, params])

  const onPageSizeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      navigate(createUrlWithParams(params, { pageSize: e.target.value }))
    },
    [navigate, params]
  )

  const onPublishedChange = React.useCallback(
    (value: Key) => {
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

  const topContent = React.useMemo(() => {
    return (
      <div className='flex flex-col gap-4 bg-white rounded-xl p-4'>
        <div className='flex justify-between gap-3 items-end  '>
          <div className='flex items-center gap-6'>
            <Input
              isClearable
              className='flex-1'
              placeholder='Search by name...'
              startContent={<Icon icon='material-symbols:search' />}
              value={keyword ?? ''}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
              variant='bordered'
            />

            <Dropdown>
              <DropdownTrigger className='hidden sm:flex'>
                <Button variant='flat' endContent={<Icon icon='solar:alt-arrow-down-outline' />}>
                  {filteredPublished?.name || 'All'}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label='Status' onAction={(key) => onPublishedChange(key)}>
                {publishedOptions.map((status) => (
                  <DropdownItem key={status.uid} className='capitalize'>
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger className='hidden sm:flex'>
                <Button variant='flat' endContent={<Icon icon='solar:alt-arrow-down-outline' />}>
                  {filteredSort?.name || 'Sort'}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label='Sort' onAction={onSortChange}>
                {sortOptions.map((status) => (
                  <DropdownItem key={status.uid} className='capitalize'>
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className='flex gap-3'>
            <Button className='bg-green-500 text-white' endContent={<Icon icon='ic:baseline-plus' />}>
              Add New
            </Button>
          </div>
        </div>
      </div>
    )
  }, [keyword, onSearchChange, filteredPublished?.name, filteredSort?.name, onSortChange, onClear, onPublishedChange])

  const bottomContent = React.useMemo(() => {
    if ((auctionPage?.items?.length ?? 0) > 0) {
      return (
        <div className='py-2 px-2 mx-auto'>
          <div className='flex flex-col items-center gap-4'>
            <div className='flex items-center gap-6'>
              <span className='text-small'>
                {(+pageNum - 1) * +pageSize + 1} to {(+pageNum - 1) * +pageSize + +pageSize}
              </span>
              <label className='flex items-center text-small '>
                Rows:
                <select
                  className='ml-1 outline-none border-1 border-black rounded-md text-small px-2 py-1'
                  value={params.pageSize}
                  onChange={onPageSizeChange}
                >
                  <option value='5'>5</option>
                  <option value='10'>10</option>
                  <option value='15'>15</option>
                </select>
              </label>
            </div>
            {auctionPage?.totalPages && auctionPage.totalPages > 1 && (
              <Pagination
                isCompact
                showControls
                showShadow
                color='primary'
                page={Number(params.pageNum)}
                total={auctionPage?.totalPages ?? 0}
                onChange={(page) => navigate(createUrlWithParams(params, { pageNum: page }))}
              />
            )}
          </div>
        </div>
      )
    }
    return null
  }, [auctionPage?.items?.length, auctionPage?.totalPages, navigate, onPageSizeChange, pageNum, pageSize, params])

  if (!auctionPage) return

  return (
    <section>
      <div className='flex items-center gap-2 mb-6'>
        <h1 className='text-2xl font-[700] leading-[32px]'>Auctions</h1>
        <Chip color='secondary' className='hidden items-center sm:flex' size='sm' variant='solid'>
          {auctionPage?.totalItems} items
        </Chip>
      </div>
      <Table
        aria-label='Auctions Table'
        topContent={topContent}
        topContentPlacement='outside'
        bottomContent={bottomContent}
        bottomContentPlacement='outside'
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={auctionPage?.items}
          emptyContent={
            <div>
              <p>No item found</p>
            </div>
          }
        >
          {(item) => (
            <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  )
}
export default Auctions
