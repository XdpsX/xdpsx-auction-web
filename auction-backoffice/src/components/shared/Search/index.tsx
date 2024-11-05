import { Icon } from '@iconify/react'
import { cn, Input } from '@nextui-org/react'

interface SearchProps {
  value: string
  onClear: () => void
  onSearch: (keyword: string) => void
  className?: string
}

function Search({ value, onClear, onSearch, className }: SearchProps) {
  return (
    <Input
      isClearable
      className={cn('max-w-sm', className)}
      placeholder='Search by name...'
      startContent={<Icon icon='material-symbols:search' />}
      value={value}
      onClear={() => onClear()}
      onValueChange={onSearch}
      variant='bordered'
    />
  )
}
export default Search
