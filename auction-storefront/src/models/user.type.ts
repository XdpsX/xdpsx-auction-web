import * as yup from 'yup'

export type UserProfile = {
  id: number
  name: string
  email: string
  avatarUrl: string | null
  mobileNumber: string | null
  address: string | null
  balance: number
}

export const profileSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .max(64, 'Name must not exceed 64 characters'),
  mobileNumber: yup
    .string()
    .max(15, 'Mobile number must not exceed 15 characters'),
  address: yup.string().max(255, 'Address must not exceed 255 characters'),
  imageId: yup.number().nullable(),
})

export type ProfilePayload = yup.InferType<typeof profileSchema>
