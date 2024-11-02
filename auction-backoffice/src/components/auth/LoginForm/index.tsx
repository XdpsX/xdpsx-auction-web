import React from 'react'
import { Button, Input, Link } from '@nextui-org/react'
import { Icon } from '@iconify/react'

function LoginForm() {
  const [isVisible, setIsVisible] = React.useState(false)

  const toggleVisibility = () => setIsVisible(!isVisible)

  return (
    <form className='flex flex-col gap-3' onSubmit={(e) => e.preventDefault()}>
      <Input label='Email Address' name='email' type='email' variant='bordered' />
      <Input
        endContent={
          <button type='button' onClick={toggleVisibility}>
            {isVisible ? (
              <Icon className='pointer-events-none text-2xl text-default-400' icon='solar:eye-closed-linear' />
            ) : (
              <Icon className='pointer-events-none text-2xl text-default-400' icon='solar:eye-bold' />
            )}
          </button>
        }
        label='Password'
        name='password'
        type={isVisible ? 'text' : 'password'}
        variant='bordered'
        autoComplete='password'
      />
      <div className='text-end px-1'>
        <Link className='text-default-500' href='#' size='sm'>
          Forgot password?
        </Link>
      </div>
      <Button color='primary' type='submit'>
        Log In
      </Button>
    </form>
  )
}
export default LoginForm
