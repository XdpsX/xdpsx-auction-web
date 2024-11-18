import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Button, Input } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import { LoginPayload, loginSchema } from '~/app/features/auth/type'
import useAppDispatch from '~/app/hooks/useAppDispatch'
import useAppSelector from '~/app/hooks/useAppSelector'
import { login } from '~/app/features/auth'
import SocialButtons from '~/components/SocialButtons'

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading } = useAppSelector((state) => state.auth)
  const [isVisible, setIsVisible] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: 'admina@xdpsx.com',
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
    <div className='flex h-full w-full items-center justify-center'>
      <div className='flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small'>
        <p className='pb-2 text-xl font-medium'>Log In</p>

        <form className='flex flex-col gap-3' onSubmit={handleSubmit(onSubmit)}>
          <Input
            label='Email Address'
            type='email'
            variant='bordered'
            {...register('email')}
            isInvalid={!!errors.email}
          />
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
            <Link className='text-default-500 text-sm' to='#'>
              Forgot password?
            </Link>
          </div>
          <Button color='primary' type='submit' isLoading={isLoading}>
            {isLoading ? 'Loading...' : 'Login'}
          </Button>
        </form>

        <SocialButtons />
        <p className='text-center text-small'>
          Need to create an account?&nbsp;
          <Link to='/register' className='text-blue-500'>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
