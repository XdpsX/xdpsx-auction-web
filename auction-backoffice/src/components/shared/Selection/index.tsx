import { cn, Select, SelectItem } from '@nextui-org/react'
import { capitalize } from '~/utils/helper'
import { SelectItemType } from './type'

interface SelectionProps {
  label: string
  variant?: 'solid' | 'outline'
  items: SelectItemType[]
  selectedKey: string[]
  onChange: (value: string) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function Selection({ label, variant = 'solid', items, selectedKey, onChange, className, size = 'sm' }: SelectionProps) {
  const styles = {
    solid: {
      trigger: 'bg-blue-500/85 hover:!bg-blue-500/85 border-none hover:!border-none !text-white',
      label: '!text-white text-sm -mt-2',
      value: '!text-white font-semibold text-base'
    },
    outline: {
      trigger: 'bg-blue-white hover:!bg-gray-100/80 border-blue-500 hover:!border-blue-500 !text-blue-500',
      label: '!text-blue-400 -mt-2',
      value: '!text-gray-700 font-semibold '
    }
  }

  return (
    <Select
      aria-label={label}
      label={label}
      // variant='faded'
      variant='flat'
      size={size}
      className={cn('max-w-32 ', className)}
      // classNames={{
      //   trigger: styles[variant].trigger,
      //   label: styles[variant].label,
      //   value: styles[variant].value
      // }}
      selectedKeys={selectedKey}
      onChange={(e) => onChange(e.target.value)}
    >
      {items.map((item) => (
        <SelectItem key={item.key}>{capitalize(item.title)}</SelectItem>
      ))}
    </Select>
  )
}
export default Selection
