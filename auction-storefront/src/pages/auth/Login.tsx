import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import * as yup from 'yup'
import SocialLogin from '../../components/auth/SocialLogin'
import InputField from '../../components/ui/InputField'

const schema = yup.object().shape({
  email: yup
    .string()
    .required('Please enter your email address')
    .email('Please enter a valid email address')
    .max(64, 'Email must not exceed 64 characters'),
  password: yup
    .string()
    .required('Please enter your password')
    .min(8, 'Password must be at least 8 characters')
    .max(255, 'Password must not exceed 255 characters'),
})
function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data) => {
    console.log(data)
    // Xử lý đăng ký ở đây
  }

  return (
    <div className="min-w-[420px] flex flex-col justify-center px-6 py-8 lg:px-8 bg-white text-gray-800">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight ">
          Login to your account
        </h2>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <InputField
            control={control}
            name="email"
            label="Email address"
            type="email"
            error={errors.email}
          />
          <InputField
            control={control}
            name="password"
            label="Password"
            type="password"
            error={errors.password}
          />

          <div className="text-sm text-end">
            <a
              href="#"
              className="font-semibold text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </a>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p>
            <span>New members? </span>
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

        <SocialLogin />
      </div>
    </div>
  )
}
export default Login
