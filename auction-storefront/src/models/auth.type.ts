import * as yup from 'yup'

export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .required('Please enter your email address')
    // .email('Please enter a valid email address')
    .max(64, 'Email must not exceed 64 characters'),
})
export type RegisterRequest = yup.InferType<typeof registerSchema>

export const accountCreateSchema = yup.object().shape({
  name: yup
    .string()
    .required('Please enter your name')
    .max(64, 'Name must not exceed 64 characters'),
  password: yup
    .string()
    .required('Please enter your password')
    .min(8, 'Password must be at least 8 characters')
    .max(255, 'Password must not exceed 255 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Please confirm your password'),
  verify: yup
    .object()
    .shape({
      email: yup
        .string()
        .required('Please enter your email address')
        .email('Please enter a valid email address')
        .max(64, 'Email must not exceed 64 characters'),
      otp: yup
        .string()
        .required('Please enter OTP')
        .max(6, 'OTP must not exceed 6 characters'),
    })
    .required('Verification details are required'),
})
export type AccountCreateRequest = yup.InferType<
  ReturnType<typeof accountCreateSchema.omit<'confirmPassword'>>
>

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Please enter your email address')
    .max(64, 'Email must not exceed 64 characters'),
  password: yup
    .string()
    .required('Please enter your password')
    .min(8, 'Password must be at least 8 characters')
    .max(255, 'Password must not exceed 255 characters'),
})
export type LoginRequest = yup.InferType<typeof loginSchema>
