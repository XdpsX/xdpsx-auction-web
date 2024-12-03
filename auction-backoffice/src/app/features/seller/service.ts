import api from '~/utils/api'
import { Page } from '../page/type'
import { SellerProfile } from './type'

export const fetchSellersAPI = async (
  pageNum: number,
  pageSize: number,
  keyword: string | null,
  sort: string,
  status: string | null
) => {
  const response = await api.get<Page<SellerProfile>>(`/backoffice/sellers`, {
    params: {
      pageNum,
      pageSize,
      keyword,
      sort,
      status
    }
  })
  return response.data
}

export const fetchSellerRegistersAPI = async (
  pageNum: number,
  pageSize: number,
  keyword: string | null,
  sort: string
) => {
  const response = await api.get<Page<SellerProfile>>(`/backoffice/sellers/register-list`, {
    params: {
      pageNum,
      pageSize,
      keyword,
      sort
    }
  })
  return response.data
}

export const updateSellerStatusAPI = async (sellerId: number, status: string) => {
  const response = await api.put<SellerProfile>(`/backoffice/sellers/${sellerId}/status/${status}`)
  return response.data
}
