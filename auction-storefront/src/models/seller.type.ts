import * as yup from 'yup'
export type SellerProfile = {
  id: number
  name: string
  address: string
  mobilePhone: string
  avatarUrl: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export const sellerSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .max(64, 'Name must not exceed 64 characters'),
  mobileNumber: yup
    .string()
    .required('Mobile number is required')
    .max(15, 'Mobile number must not exceed 15 characters'),
  address: yup
    .string()
    .required('Address is required')
    .max(255, 'Address must not exceed 255 characters'),
  imageId: yup.number().nullable(),
})

export type SellerProfilePayload = yup.InferType<typeof sellerSchema>
