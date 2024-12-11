import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AdminStatistics, AuctionTypeCount, MonthlyRevenue, SellerStatistics } from './type'
import { fetchAdminStatsAPI, fetchAuctionTypeCountAPI, fetchRevenueAPI, fetchSellerStatsAPI } from './service'

export interface ReportState {
  adminStats: AdminStatistics | null
  sellerStats: SellerStatistics | null
  revenues: MonthlyRevenue[] | null
  auctionTypeCount: AuctionTypeCount[] | null
  isLoadingStats: boolean
  isLoadingRevenue: boolean
  isLoadingAuctionTypeCount: boolean
}

const initialState: ReportState = {
  adminStats: null,
  sellerStats: null,
  revenues: null,
  auctionTypeCount: null,
  isLoadingStats: false,
  isLoadingRevenue: false,
  isLoadingAuctionTypeCount: false
}

export const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchAdminStatsAsync
    builder.addCase(fetchAdminStatsAsync.pending, (state) => {
      state.isLoadingStats = true
    })
    builder.addCase(fetchAdminStatsAsync.fulfilled, (state, action) => {
      state.adminStats = action.payload
      state.isLoadingStats = false
    })
    builder.addCase(fetchAdminStatsAsync.rejected, (state) => {
      state.isLoadingStats = false
    })
    // fetchSellerStatsAsync
    builder.addCase(fetchSellerStatsAsync.pending, (state) => {
      state.isLoadingStats = true
    })
    builder.addCase(fetchSellerStatsAsync.fulfilled, (state, action) => {
      state.sellerStats = action.payload
      state.isLoadingStats = false
    })
    builder.addCase(fetchSellerStatsAsync.rejected, (state) => {
      state.isLoadingStats = false
    })
    // fetchRevenueAsync
    builder.addCase(fetchRevenueAsync.pending, (state) => {
      state.isLoadingRevenue = true
    })
    builder.addCase(fetchRevenueAsync.fulfilled, (state, action) => {
      state.revenues = action.payload
      state.isLoadingRevenue = false
    })
    builder.addCase(fetchRevenueAsync.rejected, (state) => {
      state.isLoadingRevenue = false
    })
    // fetchAuctionTypeCountAsync
    builder.addCase(fetchAuctionTypeCountAsync.pending, (state) => {
      state.isLoadingAuctionTypeCount = true
    })
    builder.addCase(fetchAuctionTypeCountAsync.fulfilled, (state, action) => {
      state.auctionTypeCount = action.payload
      state.isLoadingAuctionTypeCount = false
    })
    builder.addCase(fetchAuctionTypeCountAsync.rejected, (state) => {
      state.isLoadingAuctionTypeCount = false
    })
  }
})

const reportReducer = reportSlice.reducer
export default reportReducer

export const fetchAdminStatsAsync = createAsyncThunk('report/fetchAdminStatsAsync', async () => {
  const data = await fetchAdminStatsAPI()
  return data
})
export const fetchSellerStatsAsync = createAsyncThunk('report/fetchSellerStatsAsync', async () => {
  const data = await fetchSellerStatsAPI()
  return data
})

export const fetchRevenueAsync = createAsyncThunk('report/fetchRevenueAsync', async () => {
  const data = await fetchRevenueAPI()
  return data
})

export const fetchAuctionTypeCountAsync = createAsyncThunk('report/fetchAuctionTypeCountAsync', async () => {
  const data = await fetchAuctionTypeCountAPI()
  return data
})
