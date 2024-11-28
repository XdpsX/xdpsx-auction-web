import cn from '../../utils/cn'

export interface SelectOptionType {
  key: string
  title: string
}

interface SelectProps {
  label?: string
  id?: string
  selectKey: string
  options: SelectOptionType[]
  onChange: (key: string) => void
  divClassName?: string
  labelClassName?: string
  className?: string
}

const Select = ({
  label,
  id,
  selectKey,
  options,
  onChange,
  divClassName,
  labelClassName,
  className,
}: SelectProps) => {
  return (
    <div className={cn('flex items-center gap-2', divClassName)}>
      {label && (
        <label htmlFor={id} className={labelClassName}>
          {label}
        </label>
      )}
      <select
        id={id}
        value={selectKey}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'px-2 py-1 text-sm md:text-base focus:border-blue-500 outline-none bg-white border-slate-700 rounded-md text-black',
          className
        )}
      >
        {options.map((option) => (
          <option key={option.key} value={option.key}>
            {option.title}
          </option>
        ))}
      </select>
    </div>
  )
}
export default Select
