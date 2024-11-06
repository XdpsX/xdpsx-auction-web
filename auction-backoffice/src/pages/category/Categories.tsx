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
  Spinner
} from '@nextui-org/react'
import { Icon } from '@iconify/react'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { fetchAllCategories } from '~/features/category.slice'
import { Category } from '~/types/category'
import useQueryParams from '~/hooks/useQueryParams'

import { publishedOptions, sortOptions } from '~/utils/data'
import AddButton from '~/components/shared/AddButton'
import TableBottom from '~/components/shared/TableBottom'

import Search from '~/components/shared/Search'
import Sort from '~/components/shared/Sort'
import Filter from '~/components/shared/Filter'
import FilterResult from '~/components/shared/FilterResult'
import { DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE, DEFAULT_PUBLISHED, DEFAULT_SORT } from '~/constants'

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

  const { params, setParams, deleteAllParams } = useQueryParams()
  const pageNum = params.pageNum || DEFAULT_PAGE_NUM
  const pageSize = params.pageSize || DEFAULT_PAGE_SIZE
  const keyword = params.keyword || null
  const published = params.published || DEFAULT_PUBLISHED.key
  const sort = params.sort || DEFAULT_SORT.key

  const { categoryPage, isLoading } = useAppSelector((state) => state.category)

  const filteredPublished = useMemo(() => publishedOptions.find((option) => option.key === published), [published])
  const filteredSort = useMemo(() => sortOptions.find((option) => option.key === sort), [sort])

  useEffect(() => {
    dispatch(
      fetchAllCategories({
        pageNum: Number(pageNum),
        pageSize: Number(pageSize),
        keyword: keyword || null,
        published: published === 'all' ? null : published === 'true' ? true : false,
        sort: sort
      })
    )
  }, [dispatch, published, keyword, pageNum, pageSize, sort])

  const onClear = React.useCallback(() => {
    setParams({ keyword: '', pageNum: 1 })
  }, [setParams])

  const onPageChange = React.useCallback(
    (newPageNum: number) => {
      setParams({ pageNum: newPageNum })
    },
    [setParams]
  )

  const onPageSizeChange = React.useCallback(
    (newPageSize: number) => {
      setParams({ pageSize: newPageSize })
    },
    [setParams]
  )

  const onFilterChange = (selectedValues: Record<string, string>) => {
    setParams({
      published: selectedValues['published'] === 'all' ? '' : String(selectedValues['published'])
    })
  }

  const onSortChange = React.useCallback(
    (value: Key) => {
      setParams({ sort: String(value) })
    },
    [setParams]
  )

  const onSearchChange = React.useCallback(
    (value: string) => {
      setParams({ keyword: value, pageNum: 1 })
    },
    [setParams]
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
    <section className='flex flex-col gap-6'>
      <div className='flex items-center justify-between gap-2'>
        <h1 className='page-heading'>Categories</h1>
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
            },
            {
              key: keyword || '',
              title: keyword ? `Search: ${keyword}` : '',
              exceptKey: '',
              onClear: () => setParams({ keyword: '' })
            }
          ]}
          onClearAll={deleteAllParams}
        />
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
