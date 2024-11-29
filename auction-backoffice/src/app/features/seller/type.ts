import { UserInfo } from '../user/type'

export type SellerProfile = {
  id: number
  name: string
  address: string
  mobilePhone: string
  avatarUrl: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: 'string'
  user: UserInfo
}

export type SellerInfo = {
  id: number
  name: string
  avatarUrl: string
  address: string
  mobilePhone: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}
