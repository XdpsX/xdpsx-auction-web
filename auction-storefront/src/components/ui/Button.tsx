import React from 'react'
import cn from '../../utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={cn(
        'rounded-md px-3 py-2 font-semibold leading-6 text-white shadow-sm',
        className,
        { 'opacity-80 cursor-not-allowed': disabled }
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
