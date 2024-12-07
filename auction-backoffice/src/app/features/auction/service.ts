import { Auction, AuctionDetailsGet, AuctionPayload } from '~/app/features/auction/type'
import { Page } from '~/app/features/page/type'
import api from '~/utils/api'
import { Media } from '../media/type'

export const fetchAllAuctionsAPI = async (
  pageNum: number,
  pageSize: number,
  keyword: string | null,
  sort: string | null,
  published?: boolean | null
): Promise<Page<Auction>> => {
  const response = await api.get<Page<Auction>>('/backoffice/auctions/all', {
    params: {
      pageNum,
      pageSize,
      keyword,
      sort,
      published
    }
  })
  return response.data
}

export const fetchTrashedAuctionsAPI = async (
  pageNum: number,
  pageSize: number,
  keyword: string | null,
  sort: string | null,
  published?: boolean | null
): Promise<Page<Auction>> => {
  const response = await api.get<Page<Auction>>('/backoffice/auctions/trashed', {
    params: {
      pageNum,
      pageSize,
      keyword,
      sort,
      published
    }
  })
  return response.data
}

export const fetchMyAuctionsAPI = async (
  pageNum: number,
  pageSize: number,
  keyword: string | null,
  sort: string | null,
  published?: boolean | null
): Promise<Page<Auction>> => {
  const response = await api.get<Page<Auction>>('/backoffice/auctions/me', {
    params: {
      pageNum,
      pageSize,
      keyword,
      sort,
      published
    }
  })
  return response.data
}

export const uploadAuctionImageAPI = async (file: File): Promise<Media> => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post<Media>('/backoffice/auctions/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const createAuctionAPI = async (payload: AuctionPayload): Promise<Auction> => {
  const response = await api.post<Auction>('/backoffice/auctions', payload)
  return response.data
}

export const fetchAuctionDetailsAPI = async (id: number) => {
  const response = await api.get<AuctionDetailsGet>(`/backoffice/auctions/${id}`)
  return response.data
}

export const fetchSellerAuctionDetailsAPI = async (id: number) => {
  const response = await api.get<AuctionDetailsGet>(`/backoffice/seller/auctions/${id}`)
  return response.data
}
