import { cn, Pagination, Select, SelectItem } from '@nextui-org/react'

interface TableBottomProps {
  pageNum: number
  pageSize: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  className?: string
}

function TableBottom({
  pageNum,
  pageSize,
  totalPages,
  totalItems,
  onPageChange,
  onPageSizeChange,
  className
}: TableBottomProps) {
  const firstItem = (pageNum - 1) * pageSize + 1
  const lastItem = (pageNum - 1) * pageSize + pageSize
  return (
    <div className={cn('flex lg:justify-center relative w-full', className)}>
      {totalPages > 1 && (
        <Pagination
          isCompact
          showControls
          showShadow
          color='primary'
          page={pageNum}
          total={totalPages}
          onChange={onPageChange}
        />
      )}

      <div className='flex items-center gap-5 absolute right-0 top-1/2 -translate-y-1/2'>
        <span className='text-sm'>
          {firstItem} to {lastItem} of {totalItems}
        </span>
        <div className='flex items-center gap-2'>
          <span className='text-sm'>Rows:</span>
          <Select
            size='sm'
            variant='underlined'
            selectedKeys={[`${pageSize}`]}
            onChange={(e) => onPageSizeChange(+e.target.value)}
            labelPlacement='outside-left'
            className='flex items-center w-14'
          >
            <SelectItem key='3'>3</SelectItem>
            <SelectItem key='10'>10</SelectItem>
            <SelectItem key='20'>20</SelectItem>
          </Select>
        </div>
      </div>
    </div>
  )
}
export default TableBottom
