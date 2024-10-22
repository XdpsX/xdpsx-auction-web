import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FaArrowRight } from 'react-icons/fa'
import { RegisterRequest, registerSchema } from '../../models/auth.type'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { registerAPI } from '../../features/auth/auth.thunk'
import { selectAuth } from '../../features/auth/auth.slice'
import { CREATE_ACCOUNT_STEP } from '../../constants/steps'
import SocialLogin from './SocialLogin'
import Input from '../ui/Input'
import Button from '../ui/Button'
import LoadingOverlay from '../ui/LoadingOverlay'

function RegisterForm({
  setCurrentStep,
}: {
  setCurrentStep: (step: number) => void
}) {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector(selectAuth)
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (data: RegisterRequest) => {
    dispatch(registerAPI(data))
      .unwrap()
      .then(() => {
        setCurrentStep(CREATE_ACCOUNT_STEP)
      })
      .catch((err) => {
        console.log(err)
        if (err.fieldErrors) {
          Object.keys(err.fieldErrors).forEach((key) => {
            setError(key as keyof RegisterRequest, {
              type: 'manual',
              message: err.fieldErrors[key],
            })
          })
        }
      })
  }

  return (
    <div className="relative w-[380px] lg:w-[420px] px-6 pt-6 pb-8 lg:px-8 rounded-md bg-white text-gray-800">
      <div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight ">
            Register new account
          </h2>
        </div>
        {error && (
          <p className="text-red-500 text-center font-semibold mt-1">
            {error.message}
          </p>
        )}
        <div className="mt-6 sm:mx-auto sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mb-6">
            <Input
              control={control}
              name="email"
              error={errors.email}
              type="email"
              placeholder="Enter email address"
            />

            <Button
              type="submit"
              disabled={!isValid}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <div className="flex gap-2 items-center justify-center">
                Continue
                <FaArrowRight />
              </div>
            </Button>
          </form>

          <SocialLogin />

          <div className="mt-6 text-center">
            <p>
              <span>Already have account? </span>
              <span>
                <Link
                  to="/login"
                  className="text-yellow-600 font-semibold cursor-pointer hover:text-yellow-500"
                >
                  Login now
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
      {isLoading && <LoadingOverlay />}
    </div>
  )
}
export default RegisterForm
