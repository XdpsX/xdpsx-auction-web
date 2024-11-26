import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Bid, BidPayload } from '../../models/bid.type'
import { RootState } from '../../store/type'
import { fromAxiosErrorToAPIErrorDetails } from '../../utils/error.helper'
import { APIErrorDetails } from '../../models/error.type'
import { getUserBidAPI, placeBidAPI, refundBidAPI } from './service'

export interface BidState {
  userBid: Bid | null
  isLoading: boolean
  isProcessing: boolean
  error: APIErrorDetails | null
}

const initialState: BidState = {
  userBid: null,
  isLoading: false,
  isProcessing: false,
  error: null,
}

export const bidSlice = createSlice({
  name: 'bid',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // placeBidAsync
    builder.addCase(placeBidAsync.pending, (state) => {
      state.isProcessing = true
    })
    builder.addCase(placeBidAsync.fulfilled, (state, action) => {
      state.isProcessing = false
      state.userBid = action.payload
    })
    builder.addCase(placeBidAsync.rejected, (state, action) => {
      state.isProcessing = false
      state.error = action.payload as APIErrorDetails
    })
    // getUserBidAsync
    builder.addCase(getUserBidAsync.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getUserBidAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.userBid = action.payload
    })
    builder.addCase(getUserBidAsync.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as APIErrorDetails
    })
    // refundBidAsync
    builder.addCase(refundBidAsync.pending, (state) => {
      state.isProcessing = true
    })
    builder.addCase(refundBidAsync.fulfilled, (state) => {
      state.isProcessing = false
      state.userBid = null
    })
    builder.addCase(refundBidAsync.rejected, (state) => {
      state.isProcessing = false
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

export const getUserBidAsync = createAsyncThunk(
  'bid/getUserBidAsync',
  async (auctionId: number, thunkAPI) => {
    try {
      const data = await getUserBidAPI(auctionId)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)

export const refundBidAsync = createAsyncThunk(
  'bid/refundBidAsync',
  async (bidId: number) => {
    await refundBidAPI(bidId)
  }
)
