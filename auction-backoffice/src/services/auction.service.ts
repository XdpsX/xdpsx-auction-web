import { Auction } from '~/types/auction'
import { Page } from '~/types/page'
import api from '~/utils/api'

export const fetchAllAuctionsAPI = async (
  pageNum: number,
  pageSize: number,
  keyword: string | null,
  sort: string | null,
  hasPublished?: boolean | null
): Promise<Page<Auction>> => {
  const response = await api.get<Page<Auction>>('/backoffice/auctions/all', {
    params: {
      pageNum,
      pageSize,
      keyword,
      sort,
      hasPublished
    }
  })
  return response.data
}

export const fetchMyAuctionsAPI = async (
  pageNum: number,
  pageSize: number,
  keyword: string | null,
  sort: string | null,
  hasPublished?: boolean | null
): Promise<Page<Auction>> => {
  const response = await api.get<Page<Auction>>('/backoffice/auctions/me', {
    params: {
      pageNum,
      pageSize,
      keyword,
      sort,
      hasPublished
    }
  })
  return response.data
}
