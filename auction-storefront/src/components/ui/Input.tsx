import { InputHTMLAttributes, useState } from 'react'
import { Controller } from 'react-hook-form'
import { Control, FieldError } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import cn from '../../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any>
  name: string
  error?: FieldError
  type?: 'text' | 'password' | 'email' | 'number'
  classNameInput?: string
}

const Input: React.FC<InputProps> = ({
  control,
  name,
  error,
  type = 'text',
  classNameInput,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const formatNumber = (value: string | number | undefined) =>
    String(value || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  const unformatNumber = (value: string) => value.replace(/,/g, '')
  if (control) {
    return (
      <div className="relative">
        <Controller
          name={name}
          control={control}
          render={({ field: { value, onChange } }) => (
            <input
              value={type === 'number' ? formatNumber(value) : value}
              onChange={(e) => {
                if (type === 'number') {
                  const unformattedValue = unformatNumber(e.target.value)
                  if (rest.max && Number(unformattedValue) > Number(rest.max)) {
                    onChange(rest.max)
                    return
                  }
                  if (!isNaN(Number(unformattedValue))) {
                    onChange(unformattedValue)
                  }
                } else {
                  onChange(e.target.value)
                }
              }}
              id={name}
              type={type === 'password' && !showPassword ? 'password' : 'text'}
              {...rest}
              className={cn(
                'block w-full rounded-md border-0 ps-4 pe-12 py-2 text-gray-900 shadow-sm ring-1 ring-inset',
                {
                  'placeholder:text-gray-400 text-lg sm:leading-6 ring-gray-300':
                    true,
                },
                classNameInput,
                {
                  'ring-red-300 focus:outline-red-500': error,
                }
              )}
            />
          )}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
        {error && (
          <p className="absolute text-sm text-red-500">{error.message}</p>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <input
        id={name}
        type={type === 'password' && !showPassword ? 'password' : 'text'}
        {...rest}
        className={cn(
          'block w-full rounded-md border-0 ps-4 pe-12 py-2 text-gray-900 shadow-sm ring-1 ring-inset',
          {
            'placeholder:text-gray-400 text-lg sm:leading-6 ring-gray-300':
              true,
          },
          classNameInput,
          {
            'ring-red-300 focus:outline-red-500': error,
          }
        )}
      />
      {type === 'password' && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  )
}

export default Input
