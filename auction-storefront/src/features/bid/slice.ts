import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Bid, BidInfo, BidPayload } from '../../models/bid.type'
import { RootState } from '../../store/type'
import { fromAxiosErrorToAPIErrorDetails } from '../../utils/error.helper'
import { APIErrorDetails } from '../../models/error.type'
import {
  fetchMyBidsAPI,
  fetchMyWonBidAPI,
  getUserBidAPI,
  placeBidAPI,
  refundBidAPI,
} from './service'
import { Page } from '../../models/page.type'

export interface BidState {
  userBid: Bid | null
  userBids: Page<BidInfo> | null
  currentBidId: number | null
  checkoutBid: BidInfo | null
  isLoading: boolean
  isProcessing: boolean
  error: APIErrorDetails | null
}

const initialState: BidState = {
  userBid: null,
  userBids: null,
  currentBidId: null,
  checkoutBid: null,
  isLoading: false,
  isProcessing: false,
  error: null,
}

export const bidSlice = createSlice({
  name: 'bid',
  initialState,
  reducers: {
    setCurrentBidId: (state, action) => {
      state.currentBidId = action.payload
    },
  },
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
    builder.addCase(refundBidAsync.fulfilled, (state, action) => {
      state.isProcessing = false
      state.userBid = action.payload
      console.log(action.payload)
      if (state.userBids && state.currentBidId) {
        state.userBids.items = state.userBids.items.filter(
          (bid) => bid.id !== state.currentBidId
        )
        state.userBids.totalItems -= 1
      }
    })
    builder.addCase(refundBidAsync.rejected, (state) => {
      state.isProcessing = false
    })
    // fetchMyBidsAsync
    builder.addCase(fetchMyBidsAsync.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchMyBidsAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.userBids = action.payload
    })
    builder.addCase(fetchMyBidsAsync.rejected, (state) => {
      state.isLoading = false
    })
    // fetchMyWonBidAsync
    builder.addCase(fetchMyWonBidAsync.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchMyWonBidAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.checkoutBid = action.payload
    })
    builder.addCase(fetchMyWonBidAsync.rejected, (state) => {
      state.isLoading = false
    })
  },
})

const bidReducer = bidSlice.reducer
export default bidReducer
export const selectBid = (state: RootState) => state.bid
export const { setCurrentBidId } = bidSlice.actions

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
  async (bidId: number, thunkAPI) => {
    try {
      const data = await refundBidAPI(bidId)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)

export const fetchMyBidsAsync = createAsyncThunk(
  'bid/fetchMyBidsAsync',
  async (
    {
      pageNum,
      pageSize,
      sort,
      status,
    }: {
      pageNum: number
      pageSize: number
      sort: string
      status: string
    },
    thunkAPI
  ) => {
    try {
      const data = await fetchMyBidsAPI(pageNum, pageSize, sort, status)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)

export const fetchMyWonBidAsync = createAsyncThunk(
  'bid/fetchMyWonBidAsync',
  async (bidId: number, thunkAPI) => {
    try {
      const data = await fetchMyWonBidAPI(bidId)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)
