import { Chip } from '@nextui-org/react'
import { FilterResultItem } from './type'
import { Button } from '@nextui-org/react'

function FilterResult({ items, onClearAll }: { items: FilterResultItem[]; onClearAll: () => void }) {
  const filteredItems = items.filter((item) => item.key !== item.exceptKey)

  return (
    <div className='flex items-center gap-4'>
      {filteredItems.map((item) => (
        <Chip key={item.key} onClose={item.onClear}>
          {item.title}
        </Chip>
      ))}
      {filteredItems.length > 0 && (
        <Button size='sm' variant='flat' color='danger' onClick={onClearAll}>
          Clear All
        </Button>
      )}
    </div>
  )
}

export default FilterResult
