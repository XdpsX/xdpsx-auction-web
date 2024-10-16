import { InputHTMLAttributes } from 'react'
import { UseFormRegister } from 'react-hook-form'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  classNameLabel?: string
  classNameInput?: string
  classNameError?: string
  label: string
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  error?: string
  type: string
  id: string
}

function InputField({
  classNameLabel = 'block text-sm font-medium leading-6 text-gray-900',
  classNameInput = 'block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6',
  classNameError = 'text-red-500 text-sm',
  label,
  type,
  id,
  name,
  error,
  ...rest
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={classNameLabel}>
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          name={name}
          type={type}
          className={classNameInput}
          {...rest}
        />
      </div>
      {error && <p className={classNameError}>{error}</p>}
    </div>
  )
}
export default InputField
