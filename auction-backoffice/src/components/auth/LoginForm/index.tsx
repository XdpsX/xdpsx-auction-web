import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Input, Link } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { LoginPayload, loginSchema } from '~/types/auth'
import { login } from '~/features/auth.slice'

function LoginForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading } = useAppSelector((state) => state.auth)
  const [isVisible, setIsVisible] = React.useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '12345678'
    }
  })

  const toggleVisibility = () => setIsVisible(!isVisible)

  const onSubmit = (data: LoginPayload) => {
    dispatch(login(data))
      .unwrap()
      .then(() => {
        navigate('/')
        toast.success('Login successfully')
      })
      .catch((err) => {
        console.log(err)
        if (err.fieldErrors) {
          Object.keys(err.fieldErrors).forEach((key) => {
            setError(key as keyof LoginPayload, {
              type: 'manual',
              message: err.fieldErrors[key]
            })
          })
        }
      })
  }

  return (
    <form className='flex flex-col gap-3' onSubmit={handleSubmit(onSubmit)}>
      <Input label='Email Address' type='email' variant='bordered' {...register('email')} isInvalid={!!errors.email} />
      {errors.email && <p className='-mt-2 text-red-500 text-sm'>{errors.email.message}</p>}
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
        type={isVisible ? 'text' : 'password'}
        variant='bordered'
        autoComplete='password'
        isInvalid={!!errors.password}
        {...register('password')}
      />
      {errors.password && <p className='-mt-2 text-red-500 text-sm'>{errors.password.message}</p>}
      <div className='text-end px-1'>
        <Link className='text-default-500' href='#' size='sm'>
          Forgot password?
        </Link>
      </div>
      <Button color='primary' type='submit' isLoading={isLoading}>
        {isLoading ? 'Loading...' : 'Login'}
      </Button>
    </form>
  )
}
export default LoginForm
