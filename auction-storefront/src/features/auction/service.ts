import {
  AuctionDetails,
  Auction,
  AuctionType,
  AuctionTime,
} from '../../models/auction.type'
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

export const searchAuctionsAPI = async (
  keyword: string,
  pageNum: number,
  categoryId: number | null,
  minPrice: number | null,
  maxPrice: number | null,
  type: AuctionType | null,
  time: AuctionTime | null
): Promise<Page<Auction>> => {
  const response = await api.get<Page<Auction>>('/public/auctions/search', {
    params: {
      keyword,
      pageNum,
      categoryId,
      minPrice,
      maxPrice,
      type,
      time,
    },
  })
  return response.data
}

export const fetchBuyNowAuctionAPI = async (id: number) => {
  const response = await api.get<Auction>(`/storefront/auctions/${id}/buy-now`)
  return response.data
}
