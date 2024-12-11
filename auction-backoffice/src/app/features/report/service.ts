import api from '~/utils/api'
import { AdminStatistics, AuctionTypeCount, MonthlyRevenue, SellerStatistics } from './type'

export const fetchAdminStatsAPI = async () => {
  const response = await api.get<AdminStatistics>(`/backoffice/admin/reports/stats`)
  return response.data
}

export const fetchSellerStatsAPI = async () => {
  const response = await api.get<SellerStatistics>(`/backoffice/seller/reports/stats`)
  return response.data
}

export const fetchRevenueAPI = async () => {
  const response = await api.get<MonthlyRevenue[]>(`/backoffice/reports/revenue`)
  return response.data
}

export const fetchAuctionTypeCountAPI = async () => {
  const response = await api.get<AuctionTypeCount[]>(`/backoffice/reports/auction`)
  return response.data
}
