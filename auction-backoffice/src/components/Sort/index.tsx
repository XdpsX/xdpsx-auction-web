import { Icon } from '@iconify/react'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { SortItem } from './type'

interface SortProps {
  sortOptions: SortItem[]
  onSortChange: (key: string) => void
}

function Sort({ sortOptions, onSortChange }: SortProps) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className='bg-default-100 text-default-800'
          startContent={<Icon className='text-default-400' icon='solar:sort-linear' width={16} />}
        >
          Sort
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label='Sort' items={sortOptions}>
        {(item) => (
          <DropdownItem key={item.key} onPress={() => onSortChange(item.key)}>
            {item.title}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  )
}
export default Sort
