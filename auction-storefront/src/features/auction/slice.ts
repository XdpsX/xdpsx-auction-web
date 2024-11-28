import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AuctionDetails } from '../../models/auction.type'
import { RootState } from '../../store/type'
import { fetchAuctionDetailsAPI } from './service'

export interface AuctionState {
  auctionDetails: AuctionDetails | null
  isLoading: boolean
}

const initialState: AuctionState = {
  auctionDetails: null,
  isLoading: false,
}

export const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    setHighestBid: (state, action) => {
      if (state.auctionDetails) {
        state.auctionDetails.highestBid = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    // fetchAuctionDetailsAsync
    builder.addCase(fetchAuctionDetailsAsync.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchAuctionDetailsAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.auctionDetails = action.payload
    })
    builder.addCase(fetchAuctionDetailsAsync.rejected, (state) => {
      state.isLoading = false
    })
  },
})

const auctionReducer = auctionSlice.reducer
export default auctionReducer
export const selectAuction = (state: RootState) => state.auction
export const { setHighestBid } = auctionSlice.actions

export const fetchAuctionDetailsAsync = createAsyncThunk(
  'auction/fetchAuctionDetailsAsync',
  async (auctionId: number, thunkAPI) => {
    try {
      const data = await fetchAuctionDetailsAPI(auctionId)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
