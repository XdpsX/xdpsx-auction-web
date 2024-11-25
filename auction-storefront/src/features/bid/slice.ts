import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Bid, BidPayload } from '../../models/bid.type'
import { RootState } from '../../store/type'
import { fromAxiosErrorToAPIErrorDetails } from '../../utils/error.helper'
import { APIErrorDetails } from '../../models/error.type'
import { placeBidAPI } from './service'

export interface BidState {
  bid: Bid | null
  isLoading: boolean
  error: APIErrorDetails | null
}

const initialState: BidState = {
  bid: null,
  isLoading: false,
  error: null,
}

export const bidSlice = createSlice({
  name: 'bid',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(placeBidAsync.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(placeBidAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.bid = action.payload
    })
    builder.addCase(placeBidAsync.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as APIErrorDetails
    })
  },
})

const bidReducer = bidSlice.reducer
export default bidReducer
export const selectBid = (state: RootState) => state.bid

export const placeBidAsync = createAsyncThunk(
  'bid/placeBidAsync',
  async (
    { auctionId, payload }: { auctionId: number; payload: BidPayload },
    thunkAPI
  ) => {
    try {
      const data = await placeBidAPI({ auctionId, payload })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)
