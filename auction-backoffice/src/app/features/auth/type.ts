import * as yup from 'yup'

export const loginSchema = yup.object().shape({
  email: yup.string().required('Please enter your email address').max(64, 'Email must not exceed 64 characters'),
  password: yup
    .string()
    .required('Please enter your password')
    .min(8, 'Password must be at least 8 characters')
    .max(255, 'Password must not exceed 255 characters')
})
export type LoginPayload = yup.InferType<typeof loginSchema>
