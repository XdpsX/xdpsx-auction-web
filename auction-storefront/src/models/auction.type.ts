import { Bid } from './bid.type'
import { UserInfo } from './user.type'

export type Auction = {
  id: number
  mainImage: string
  name: string
  startingPrice: number
  startingTime: string
  endingTime: string
  type: string
  published: boolean
  seller: UserInfo
}

export type AuctionDetails = {
  id: number
  mainImage: string
  name: string
  description: string
  startingPrice: number
  stepPrice: number
  startingTime: string
  endingTime: string
  type: 'ENGLISH' | 'SEALED_BID'
  published: boolean
  category: string
  images: string[]
  seller: UserInfo
  highestBid: Bid | null
}

export type AuctionInfo = {
  id: number
  name: string
  mainImage: string
  type: 'ENGLISH' | 'SEALED_BID'
}
