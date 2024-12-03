import { SellerProfile } from '../seller/type'

export type User = {
  id: number
  name: string
  email: string
  avatarUrl: string | null
  mobileNumber: string | null
  address: string | null
  sellerDetails: SellerProfile | null
}

export type UserInfo = {
  id: number
  name: string
  email: string
  avatarUrl: string | null
}

export type UserProfile = {
  id: number
  name: string
  email: string
  avatarUrl: string | null
  mobileNumber: string | null
  address: string | null
}
