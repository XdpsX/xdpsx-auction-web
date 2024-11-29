export type User = {
  id: number
  name: string
  email: string
  avatarUrl: string | null
  mobileNumber: string | null
  address: string | null
  sellerDetails: SellerProfile | null
}

export type SellerProfile = {
  id: number
  name: string
  address: string
  mobilePhone: string
  avatarUrl: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export type SellerInfo = {
  id: number
  name: string
  avatarUrl: string
}
