import { Auction } from '../../models/auction.type'
import { Page } from '../../models/page.type'
import api from '../../utils/api'
import { fromAxiosErrorToAPIError } from '../../utils/error.helper'

export const fetchCategoryAuctionsAPI = async (
  categoryId: number,
  pageNum: number,
  pageSize: number
): Promise<Page<Auction>> => {
  try {
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
  } catch (error) {
    throw fromAxiosErrorToAPIError(error)
  }
}
