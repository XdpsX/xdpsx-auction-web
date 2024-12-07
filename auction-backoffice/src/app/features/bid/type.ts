export type BidInfo = {
  id: number
  amount: number
  auctionId: number
  bidderId: number
  status: 'ACTIVE' | 'WON' | 'LOST'
}
