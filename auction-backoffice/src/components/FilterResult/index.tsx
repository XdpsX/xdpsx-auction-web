import React, { useMemo } from 'react'
import { Chip, Button } from '@nextui-org/react'
import { FilterResultItem } from './type'

interface FilterResultProps {
  items: FilterResultItem[]
  onClearAll: () => void
}

const FilterResult: React.FC<FilterResultProps> = React.memo(({ items, onClearAll }) => {
  const filteredItems = useMemo(() => items.filter((item) => item.key !== item.exceptKey), [items])

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
})

export default FilterResult
