import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '~/app/store'
import { fetchAllAuctionsAPI, fetchMyAuctionsAPI } from '~/services/auction.service'
import { Auction } from '~/types/auction'
import { APIError } from '~/types/error'
import { Page } from '~/types/page'

export const fetchAllAuctions = createAsyncThunk(
  'auction/fetchAllAuctions',
  async (
    {
      pageNum,
      pageSize,
      keyword,
      sort,
      hasPublished
    }: { pageNum: number; pageSize: number; keyword: string | null; sort: string | null; hasPublished: boolean | null },
    thunkAPI
  ) => {
    try {
      const state = thunkAPI.getState() as RootState
      const isAdmin = state.user.roles?.includes('ADMIN')
      if (isAdmin) {
        const data = await fetchAllAuctionsAPI(pageNum, pageSize, keyword, sort, hasPublished)
        return data
      } else {
        const data = await fetchMyAuctionsAPI(pageNum, pageSize, keyword, sort, hasPublished)
        return data
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export interface AuctionState {
  auctionPage: Page<Auction>
  isLoading: boolean
  error: null | APIError
}

const initialState: AuctionState = {
  auctionPage: {
    items: [],
    pageNum: 0,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0
  },
  isLoading: false,
  error: null
}

export const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //fetchAllAuctions
      .addCase(fetchAllAuctions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchAllAuctions.fulfilled, (state, { payload }) => {
        state.auctionPage = payload
        state.isLoading = false
      })
      .addCase(fetchAllAuctions.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as APIError
      })
  }
})

const auctionReducer = auctionSlice.reducer
export default auctionReducer
