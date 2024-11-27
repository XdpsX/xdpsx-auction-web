import { AuctionDetails, Auction } from '../../models/auction.type'
import { Page } from '../../models/page.type'
import api from '../../utils/api'

export const fetchCategoryAuctionsAPI = async (
  categoryId: number,
  pageNum: number,
  pageSize: number
): Promise<Page<Auction>> => {
  const response = await api.get<Page<Auction>>(
    `/public/categories/${categoryId}/auctions`,
    {
      params: {
        pageNum,
        pageSize,
      },
    }
  )
  return response.data
}

export const fetchAuctionDetailsAPI = async (id: number) => {
  const response = await api.get<AuctionDetails>(`/public/auctions/${id}`)
  return response.data
}
