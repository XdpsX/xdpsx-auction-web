import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Bid, BidPayload } from '../../models/bid.type'
import { RootState } from '../../store/type'
import api from '../../utils/api'
import { fromAxiosErrorToAPIErrorDetails } from '../../utils/error.helper'
import { APIErrorDetails } from '../../models/error.type'

export const placeBid = createAsyncThunk(
  'bid/placeBid',
  async (
    { auctionId, payload }: { auctionId: number; payload: BidPayload },
    thunkAPI
  ) => {
    try {
      const response = await api.post<Bid>(
        `/storefront/auctions/${auctionId}/bids`,
        payload
      )
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)

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
    builder.addCase(placeBid.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(placeBid.fulfilled, (state, action) => {
      state.isLoading = false
      state.bid = action.payload
    })
    builder.addCase(placeBid.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as APIErrorDetails
    })
  },
})

const bidReducer = bidSlice.reducer
export default bidReducer
export const selectBid = (state: RootState) => state.bid
