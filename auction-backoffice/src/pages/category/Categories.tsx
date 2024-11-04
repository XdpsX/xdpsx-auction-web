import React, { Key, useEffect, useMemo } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Switch,
  Input,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Chip
} from '@nextui-org/react'
import { Icon } from '@iconify/react'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { fetchAllCategories } from '~/features/category.slice'
import { Category } from '~/types/category'
import useQueryParams from '~/hooks/useQueryParams'
import { createSearchParams, useNavigate } from 'react-router-dom'

const columns = [
  { name: 'ID', uid: 'id' },
  { name: 'IMAGE', uid: 'imgUrl' },
  { name: 'NAME', uid: 'name' },
  { name: 'SLUG', uid: 'slug' },
  { name: 'Published', uid: 'published' },
  { name: 'ACTIONS', uid: 'actions' }
]

const publishedOptions = [
  { name: 'All', uid: '' },
  { name: 'Published', uid: 'true' },
  { name: 'Unpublished', uid: 'false' }
]

const sortOptions = [
  { name: 'Name A-Z', uid: 'name' },
  { name: 'Name Z-A', uid: '-name' },
  { name: 'Oldest', uid: 'date' },
  { name: 'Newest', uid: '-date' }
]

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default function Categories() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const params = useQueryParams()
  const { pageNum, pageSize, keyword, sort, hasPublished } = useMemo(() => params, [params])
  const { categoryPage } = useAppSelector((state) => state.category)

  const filteredPublished = publishedOptions.find((option) => option.uid === hasPublished)
  const filteredSort = sortOptions.find((option) => option.uid === sort)

  useEffect(() => {
    dispatch(
      fetchAllCategories({
        pageNum: Number(pageNum),
        pageSize: Number(pageSize),
        keyword: keyword || null,
        hasPublished: hasPublished ? (hasPublished === 'true' ? true : false) : null,
        sort: sort || null
      })
    )
  }, [dispatch, hasPublished, keyword, pageNum, pageSize, sort])

  const createUrlWithParams = React.useCallback(
    (newParams: Partial<typeof params>) => {
      const updatedParams = { ...params, ...newParams }
      const searchParams = createSearchParams(
        new URLSearchParams(
          Object.entries(updatedParams)
            .filter(([, value]) => value !== undefined && value !== null && value !== '')
            .map(([key, value]) => [key, String(value)])
        )
      )
      return `?${searchParams.toString()}`
    },
    [params]
  )

  const onClear = React.useCallback(() => {
    navigate(createUrlWithParams({ keyword: '', pageNum: 1 }))
  }, [createUrlWithParams, navigate])

  const onPageSizeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      navigate(createUrlWithParams({ pageSize: e.target.value }))
    },
    [createUrlWithParams, navigate]
  )

  const onPublishedChange = React.useCallback(
    (value: Key) => {
      navigate(createUrlWithParams({ hasPublished: value === 'all' ? null : String(value) }))
    },
    [createUrlWithParams, navigate]
  )

  const onSortChange = React.useCallback(
    (value: Key) => {
      navigate(createUrlWithParams({ sort: String(value) }))
    },
    [createUrlWithParams, navigate]
  )

  const onSearchChange = React.useCallback(
    (value: string) => {
      navigate(createUrlWithParams({ keyword: value, pageNum: 1 }))
    },
    [createUrlWithParams, navigate]
  )

  const renderCell = React.useCallback((category: Category, columnKey: Key) => {
    switch (columnKey) {
      case 'id':
        return <p className='text-sm'>{category.id}</p>
      case 'imgUrl':
        return (
          <img
            className='w-10 h-10 object-cover'
            src={category.imgUrl || 'https://i.pravatar.cc/150?u=a042581f4e29026024d'}
          />
        )
      case 'name':
        return <p className='text-bold text-sm capitalize'>{category.name}</p>
      case 'slug':
        return <p className='text-sm'>{category.slug}</p>
      case 'published':
        return <Switch isSelected={category.published} />
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
          <Pagination
            isCompact
            showControls
            showShadow
            color='primary'
            page={Number(params.pageNum)}
            total={categoryPage?.totalPages ?? 0}
            onChange={(page) => navigate(createUrlWithParams({ pageNum: page }))}
          />
        </div>
      </div>
    )
  }, [categoryPage?.totalPages, createUrlWithParams, navigate, onPageSizeChange, params.pageNum, params.pageSize])

  if (!categoryPage) return null

  return (
    <section>
      <div className='flex items-center gap-2 mb-6'>
        <h1 className='text-2xl font-[700] leading-[32px]'>Categories</h1>
        <Chip color='secondary' className='hidden items-center sm:flex' size='sm' variant='solid'>
          {categoryPage?.totalItems} items
        </Chip>
      </div>
      <Table
        aria-label='Categories Table'
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
        <TableBody items={categoryPage.items}>
          {(item) => (
            <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  )
}
