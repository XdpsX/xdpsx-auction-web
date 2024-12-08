import React, { useMemo } from 'react'
import { Chip, Button } from '@nextui-org/react'
import { FilterResultItem } from './type'

interface FilterResultProps {
  items: FilterResultItem[]
  onClearAll: () => void
  userRole?: string | null
}

const FilterResult: React.FC<FilterResultProps> = ({ items, onClearAll, userRole }) => {
  const filteredItems = useMemo(() => items.filter((item) => item.key !== item.exceptKey), [items])

  return (
    <div className='flex items-center gap-4'>
      {filteredItems.map((item) => {
        if (item.exceptRole && userRole && item.exceptRole === userRole) {
          return null
        }

        return (
          <Chip key={item.key} color='primary' onClose={item.onClear}>
            {item.title}
          </Chip>
        )
      })}
      {filteredItems.length > 0 && (
        <Button size='sm' variant='flat' color='danger' onClick={onClearAll}>
          Clear All
        </Button>
      )}
    </div>
  )
}

export default FilterResult
