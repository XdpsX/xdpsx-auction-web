import { Bid, BidInfo, BidPayload } from '../../models/bid.type'
import { Page } from '../../models/page.type'
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

export const refundBidAPI = async (bidId: number) => {
  const response = await api.post<Bid>(`/storefront/bids/${bidId}/refund`)
  return response.data
}

export const fetchMyBidsAPI = async (
  pageNum: number,
  pageSize: number,
  sort: string,
  status: string
) => {
  const response = await api.get<Page<BidInfo>>(`/storefront/users/me/bids`, {
    params: {
      pageNum,
      pageSize,
      sort,
      status,
    },
  })
  return response.data
}

export const fetchMyWonBidAPI = async (bidId: number) => {
  const response = await api.get<BidInfo>(
    `/storefront/users/me/bids/won/${bidId}`
  )
  return response.data
}
