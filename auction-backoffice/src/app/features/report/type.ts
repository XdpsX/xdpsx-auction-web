import { AuctionType } from '../auction/type'

export type StatisticsCount = {
  totalCount: number
  currentMonthCount: number
  prevMonthCount: number
  percentageChange: number
}

export type StatisticsAmount = {
  totalCount: number
  currentMonthCount: number
  prevMonthCount: number
  percentageChange: number
}

export type AdminStatistics = {
  auction: StatisticsCount
  order: StatisticsCount
  user: StatisticsCount
  seller: StatisticsCount
}

export type SellerStatistics = {
  auction: StatisticsCount
  order: StatisticsCount
  bidder: StatisticsCount
  withdraw: StatisticsAmount
}

export type MonthlyRevenue = {
  month: string
  revenue: number
}

export type AuctionTypeCount = {
  type: AuctionType
  count: number
}
