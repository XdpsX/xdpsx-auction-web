import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { createAccountAPI, sendOTPAPI } from '../../features/auth/auth.thunk'
import {
  selectAuth,
  setError as setAPIError,
} from '../../features/auth/auth.slice'
import {
  AccountCreateRequest,
  accountCreateSchema,
} from '../../models/auth.type'
import { FaArrowLeft } from 'react-icons/fa'
import { REGISTER_STEP } from '../../constants/steps'
import Input from '../ui/Input'
import Button from '../ui/Button'
import LoadingOverlay from '../ui/LoadingOverlay'

function CreateAccountForm({
  setCurrentStep,
}: {
  setCurrentStep: (step: number) => void
}) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { emailRegister, isSendingOTP, isLoading, error } =
    useAppSelector(selectAuth)
  const [otpSent, setOtpSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [message, setMessage] = useState('')
  const [intervalId, setIntervalId] = useState<number | null>(null)
  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(accountCreateSchema),
    defaultValues: {
      name: '',
      password: '',
      confirmPassword: '',
      verify: {
        otp: '',
        email: '',
      },
    },
  })

  useEffect(() => {
    setValue('verify.email', emailRegister)
  }, [emailRegister, setValue])

  const sendOtp = () => {
    if (!emailRegister) return
    const startCountdown = () => {
      setOtpSent(true)
      setCountdown(60)
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval)
            setOtpSent(false)
            setMessage('')
          }
          return prev - 1
        })
      }, 1000)
      setIntervalId(interval)
    }

    dispatch(sendOTPAPI({ email: emailRegister }))
      .unwrap()
      .then(() => {
        setMessage(`OTP sent successfully to ${emailRegister}`)
        startCountdown()
      })
      .catch((err) => {
        console.log(err)
        if (err.status.includes('429')) {
          startCountdown()
        }
      })
  }

  const backToRegister = () => {
    dispatch(setAPIError(null))

    if (intervalId) {
      clearInterval(intervalId)
      setCountdown(0)
      setOtpSent(false)
    }
    setCurrentStep(REGISTER_STEP)
    setMessage('')
    reset()
  }

  const onSubmit = (data: AccountCreateRequest) => {
    console.log(data)
    dispatch(createAccountAPI(data))
      .unwrap()
      .then(() => {
        navigate('/')
        toast.success('Account created successfully')
      })
      .catch((err) => {
        console.log(err)
        if (err.fieldErrors) {
          Object.keys(err.fieldErrors).forEach((key) => {
            setError(key as keyof AccountCreateRequest, {
              type: 'manual',
              message: err.fieldErrors[key],
            })
          })
        }
      })
  }

  if (!emailRegister) {
    return null
  }

  return (
    <div className="relative w-[380px] lg:w-[420px] px-6 pt-6 pb-8 lg:px-8 rounded-md bg-white text-gray-800">
      <div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm relative">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">
            Create new account
          </h2>

          <button
            onClick={backToRegister}
            className="absolute left-0 top-1/2 -translate-y-1/2"
          >
            <FaArrowLeft size={24} />
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-center font-semibold mt-1">
            {error.message}
          </p>
        )}
        {!error && message && (
          <p className="text-green-500 text-center font-semibold mt-1">
            {message}
          </p>
        )}
        <div className="mt-6 sm:mx-auto sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Input
              control={control}
              name="name"
              error={errors.name}
              placeholder="Enter your name"
            />
            <Input
              control={control}
              name="password"
              error={errors.password}
              type="password"
              autoComplete="password"
              placeholder="Enter your password"
            />
            <Input
              control={control}
              name="confirmPassword"
              error={errors.confirmPassword}
              type="password"
              autoComplete="password"
              placeholder="Enter confirm pasword"
            />
            <div className="flex items-center gap-6">
              <div className="w-1/2">
                <Input
                  control={control}
                  name="verify.otp"
                  error={errors.verify?.otp}
                  placeholder="_ _ _ _ _ _"
                  maxLength={6}
                />
              </div>

              <Button
                type="button"
                onClick={sendOtp}
                disabled={isSendingOTP || otpSent}
                className={
                  otpSent
                    ? 'bg-gray-400 min-w-[110px]'
                    : 'bg-red-600 min-w-[110px]'
                }
              >
                {otpSent ? `Resend ${countdown}s` : 'Send OTP'}
              </Button>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Register
            </Button>
          </form>
        </div>
      </div>
      {isLoading && <LoadingOverlay />}
    </div>
  )
}
export default CreateAccountForm
