import React, { Key, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Switch,
  Spinner
} from '@nextui-org/react'
import { Icon } from '@iconify/react'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { fetchAllCategories } from '~/features/category.slice'
import { Category } from '~/types/category'
import useQueryParams from '~/hooks/useQueryParams'

import { publishedOptions, sortOptions } from '~/utils/data'
import { createUrlWithParams } from '~/utils/helper'
import AddButton from '~/components/shared/AddButton'
import TableBottom from '~/components/shared/TableBottom'

import Search from '~/components/shared/Search'
import Sort from '~/components/shared/Sort'
import Filter from '~/components/shared/Filter'

const columns = [
  { name: 'ID', uid: 'id' },
  { name: 'IMAGE', uid: 'imgUrl' },
  { name: 'NAME', uid: 'name' },
  { name: 'SLUG', uid: 'slug' },
  { name: 'PUBLISHED', uid: 'published' },
  { name: 'ACTIONS', uid: 'actions' }
]

export default function Categories() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const params = useQueryParams()
  const { pageNum, pageSize, keyword, sort, hasPublished } = useMemo(() => params, [params])
  const { categoryPage, isLoading } = useAppSelector((state) => state.category)

  const filteredPublished = publishedOptions.find((option) => option.key === hasPublished)
  const filteredSort = sortOptions.find((option) => option.key === sort)

  useEffect(() => {
    dispatch(
      fetchAllCategories({
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

  const onFilterChange = (selectedValues: Record<string, string>) => {
    navigate(
      createUrlWithParams(params, {
        hasPublished: selectedValues['hasPublished'] === 'all' ? '' : String(selectedValues['hasPublished'])
      })
    )
  }

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

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-2'>
        <h1 className='page-heading'>Categories</h1>
        <AddButton />
      </div>

      <div className='gap-4  rounded-xl p-4'>
        <div className='flex items-center gap-6 '>
          <div>
            <Search value={keyword ?? ''} onClear={onClear} onSearch={onSearchChange} />
          </div>
          <div>
            <Filter
              items={[
                {
                  key: 'hasPublished',
                  label: 'Has published ?',
                  allOptions: publishedOptions,
                  value: hasPublished
                }
              ]}
              onFilterChange={onFilterChange}
            />
          </div>
          <div>
            <Sort sortOptions={sortOptions} onSortChange={onSortChange} />
          </div>
        </div>
      </div>

      <Table aria-label='Categories Table'>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={categoryPage.items}
          emptyContent={<p>No item found</p>}
          isLoading={isLoading}
          loadingContent={<Spinner />}
        >
          {(item) => (
            <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
          )}
        </TableBody>
      </Table>

      {categoryPage.items.length > 0 && (
        <TableBottom
          pageNum={+pageNum}
          pageSize={+pageSize}
          totalItems={categoryPage.totalItems}
          totalPages={categoryPage.totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          className='mt-4'
        />
      )}
    </section>
  )
}
