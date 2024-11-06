import { Icon } from '@iconify/react'
import { Button, Popover, PopoverContent, PopoverTrigger, Radio, RadioGroup } from '@nextui-org/react'
import { FilterItemKeyValue, FilterItemType } from './type'
import { useEffect, useState, useMemo, useCallback } from 'react'

interface FilterProps {
  items: FilterItemType[]
  onFilterChange: (values: FilterItemKeyValue) => void
}

function Filter({ items, onFilterChange }: FilterProps) {
  const initialValues = useMemo(() => {
    return items.reduce((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {} as FilterItemKeyValue)
  }, [items])

  const [selectedValues, setSelectedValues] = useState(initialValues)

  useEffect(() => {
    setSelectedValues(initialValues)
  }, [initialValues])

  const handleValueChange = useCallback((key: string, value: string) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [key]: value
    }))
  }, [])

  const handlePopoverOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        setSelectedValues(initialValues)
      }
    },
    [initialValues]
  )

  const handleFilter = useCallback(() => {
    onFilterChange(selectedValues)
  }, [onFilterChange, selectedValues])

  return (
    <Popover placement='bottom' onOpenChange={handlePopoverOpenChange}>
      <PopoverTrigger>
        <Button
          className='bg-default-100 text-default-800'
          startContent={<Icon className='text-default-400' icon='solar:tuning-2-linear' width={16} />}
        >
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='flex w-full flex-col gap-6 px-2 py-4 mb-4'>
          {items.map((item) => (
            <RadioGroup
              key={item.key}
              label={item.label}
              value={selectedValues[item.key]}
              onValueChange={(value) => handleValueChange(item.key, value)}
            >
              {item.allOptions.map((option) => (
                <Radio key={option.key} value={option.key}>
                  {option.title}
                </Radio>
              ))}
            </RadioGroup>
          ))}
        </div>
        <Button color='danger' onPress={handleFilter}>
          Apply
        </Button>
      </PopoverContent>
    </Popover>
  )
}

export default Filter
