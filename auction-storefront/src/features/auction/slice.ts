import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  Auction,
  AuctionDetails,
  AuctionTime,
  AuctionType,
} from '../../models/auction.type'
import { RootState } from '../../store/type'
import {
  fetchAuctionDetailsAPI,
  fetchBuyNowAuctionAPI,
  searchAuctionsAPI,
} from './service'
import { Page } from '../../models/page.type'

export interface AuctionState {
  auctionDetails: AuctionDetails | null
  searchAuctions: Page<Auction> | null
  buyAuction: Auction | null
  isLoading: boolean
}

const initialState: AuctionState = {
  auctionDetails: null,
  searchAuctions: null,
  buyAuction: null,
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
    setAuctionDetailsEndingTime: (state, action) => {
      if (state.auctionDetails) {
        state.auctionDetails.endingTime = action.payload
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
    // searchAuctionsAsync
    builder.addCase(searchAuctionsAsync.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(searchAuctionsAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.searchAuctions = action.payload
    })
    builder.addCase(searchAuctionsAsync.rejected, (state) => {
      state.isLoading = false
    })
    // fetchBuyNowAuctionAsync
    builder.addCase(fetchBuyNowAuctionAsync.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchBuyNowAuctionAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.buyAuction = action.payload
    })
    builder.addCase(fetchBuyNowAuctionAsync.rejected, (state) => {
      state.isLoading = false
    })
  },
})

const auctionReducer = auctionSlice.reducer
export default auctionReducer
export const selectAuction = (state: RootState) => state.auction
export const { setHighestBid, setAuctionDetailsEndingTime } =
  auctionSlice.actions

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

export const searchAuctionsAsync = createAsyncThunk(
  'auction/searchAuctionsAsync',
  async (
    {
      keyword,
      pageNum,
      categoryId,
      minPrice,
      maxPrice,
      type,
      time,
    }: {
      keyword: string
      pageNum: number
      categoryId: number | null
      minPrice: number | null
      maxPrice: number | null
      type: AuctionType | null
      time: AuctionTime | null
    },
    thunkAPI
  ) => {
    try {
      const data = await searchAuctionsAPI(
        keyword,
        pageNum,
        categoryId,
        minPrice,
        maxPrice,
        type,
        time
      )
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const fetchBuyNowAuctionAsync = createAsyncThunk(
  'auction/fetchBuyNowAuctionAsync',
  async (auctionId: number, thunkAPI) => {
    try {
      const data = await fetchBuyNowAuctionAPI(auctionId)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
