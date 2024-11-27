import { Bid } from './bid.type'

export type Auction = {
  id: number
  mainImage: string
  name: string
  startingPrice: number
  startingTime: string
  endingTime: string
  auctionType: string
  published: boolean
  seller: {
    id: number
    name: string
    avatarUrl: string | null
  }
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
  auctionType: 'ENGLISH' | 'SEALED_BID'
  published: boolean
  category: string
  images: string[]
  seller: {
    id: number
    name: string
    avatarUrl: string | null
  }
  highestBid: Bid | null
}
