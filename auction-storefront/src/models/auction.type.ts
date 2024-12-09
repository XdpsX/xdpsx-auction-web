import { Bid } from './bid.type'
import { SellerInfo } from './seller.type'

export type Auction = {
  id: number
  mainImage: string
  name: string
  startingPrice: number
  startingTime: string
  endingTime: string
  type: string
  published: boolean
  seller: SellerInfo
  numBids: number | null
}

export type AuctionType = 'ENGLISH' | 'SEALED_BID'
export type AuctionTime = 'UPCOMING' | 'LIVE'

export type AuctionDetails = {
  id: number
  mainImage: string
  name: string
  description: string
  startingPrice: number
  stepPrice: number
  startingTime: string
  endingTime: string
  type: AuctionType
  published: boolean
  category: string
  images: string[]
  seller: SellerInfo
  highestBid: Bid | null
}

export type AuctionInfo = {
  id: number
  name: string
  mainImage: string
  type: AuctionType
}
