import { InputHTMLAttributes, useState } from 'react'
import { Controller } from 'react-hook-form'
import { Control, FieldError } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
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

  return (
    <div
    // className={`${error?.message ? 'mb-8' : 'mb-4'}`}
    >
      <div className="relative">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id={name}
              type={type === 'password' && showPassword ? 'text' : type}
              {...rest}
              className={`block w-full rounded-md border-0 ps-4 pe-12 py-2 text-gray-900 shadow-sm ring-1 ring-inset ${
                error ? 'ring-red-300 focus:outline-red-500' : 'ring-gray-300'
              } placeholder:text-gray-400 text-lg sm:leading-6 ${classNameInput}`}
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
    </div>
  )
}

export default Input
