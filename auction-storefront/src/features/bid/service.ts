import { Bid, BidPayload } from '../../models/bid.type'
import api from '../../utils/api'

export const placeBidAPI = async ({
  auctionId,
  payload,
}: {
  auctionId: number
  payload: BidPayload
}) => {
  const response = await api.post<Bid>(
    `/storefront/auctions/${auctionId}/bids`,
    payload
  )
  return response.data
}

export const getUserBidAPI = async (auctionId: number) => {
  const response = await api.get<Bid>(
    `/storefront/auctions/${auctionId}/my-bid`
  )
  return response.data
}
