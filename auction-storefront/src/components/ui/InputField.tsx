import { Controller } from 'react-hook-form'

import { Control, FieldError } from 'react-hook-form'

interface InputFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  label: string
  type: string
  error?: FieldError
}

const InputField: React.FC<InputFieldProps> = ({
  control,
  name,
  label,
  type,
  error,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-1">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id={name}
              type={type}
              className={`block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                error ? 'ring-red-300 focus:outline-red-500' : 'ring-gray-300'
              } placeholder:text-gray-400 sm:text-sm sm:leading-6`}
            />
          )}
        />
        {error && <p className="text-red-500">{error.message}</p>}
      </div>
    </div>
  )
}

export default InputField
