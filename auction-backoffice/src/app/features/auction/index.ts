import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '~/app/store'
import { fetchAllAuctionsAPI, fetchMyAuctionsAPI } from './service'
import { Auction } from '~/app/features/auction/type'
import { APIError } from '~/app/features/error/type'
import { Page } from '~/app/features/page/type'

export const fetchAllAuctions = createAsyncThunk(
  'auction/fetchAllAuctions',
  async (
    {
      pageNum,
      pageSize,
      keyword,
      sort,
      published
    }: { pageNum: number; pageSize: number; keyword: string | null; sort: string | null; published: boolean | null },
    thunkAPI
  ) => {
    try {
      const state = thunkAPI.getState() as RootState
      const isAdmin = state.user.roles?.includes('ADMIN')
      if (isAdmin) {
        const data = await fetchAllAuctionsAPI(pageNum, pageSize, keyword, sort, published)
        return data
      } else {
        const data = await fetchMyAuctionsAPI(pageNum, pageSize, keyword, sort, published)
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
