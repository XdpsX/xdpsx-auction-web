import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

import { loginAsync, selectAuth } from '../../features/auth/slice'
import { LoginRequest, loginSchema } from '../../models/auth.type'
import SocialLogin from '../../components/auth/SocialLogin'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import LoadingOverlay from '../../components/ui/LoadingOverlay'

function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useAppSelector(selectAuth)
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '12345678',
    },
  })

  const onSubmit = (data: LoginRequest) => {
    dispatch(loginAsync(data))
      .unwrap()
      .then(() => {
        navigate('/')
        toast.success('Login successfully')
      })
      .catch((err) => {
        console.log(err)
        if (err.fieldErrors) {
          Object.keys(err.fieldErrors).forEach((key) => {
            setError(key as keyof LoginRequest, {
              type: 'manual',
              message: err.fieldErrors[key],
            })
          })
        }
      })
  }

  return (
    <div className="flex items-center min-h-[530px] w-[360px] md:w-[380px] lg:w-[420px]">
      <div className="w-full relative md:w-[380px] lg:w-[420px] px-6 pt-6 pb-8 lg:px-8 rounded-md bg-white text-gray-800">
        <div>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight ">
              Login to your account
            </h2>
          </div>
          {error && (
            <p className="text-red-500 text-center font-semibold mt-1">
              {error.message}
            </p>
          )}
          <div className="mt-6 sm:mx-auto sm:w-ful">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <Input
                control={control}
                name="email"
                type="email"
                error={errors.email}
                placeholder="Enter your email address"
              />
              <Input
                control={control}
                name="password"
                type="password"
                error={errors.password}
                autoComplete="password"
                placeholder="Enter your password"
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Login
              </Button>
            </form>

            <div className="text-end text-sm mt-3">
              <a
                href="#"
                className="font-semibold text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </a>
            </div>

            <SocialLogin />

            <div className="mt-4 text-center">
              <p>
                <span>New member? </span>
                <span>
                  <Link
                    to="/register"
                    className="text-yellow-600 font-semibold cursor-pointer hover:text-yellow-500"
                  >
                    Register now
                  </Link>
                </span>
              </p>
            </div>
          </div>
        </div>
        {isLoading && <LoadingOverlay />}
      </div>
    </div>
  )
}
export default Login
