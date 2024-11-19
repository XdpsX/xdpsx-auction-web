export type Auction = {
  id: number
  mainImage: string
  name: string
  startingPrice: number
  startingTime: string
  endingTime: string
  auctionType: string
  published: boolean
  category: string
  seller: {
    id: number
    name: string
    avatarUrl: string | null
  }
}
