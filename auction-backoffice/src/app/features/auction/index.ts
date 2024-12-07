import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  createAuctionAPI,
  fetchAllAuctionsAPI,
  fetchAuctionDetailsAPI,
  fetchMyAuctionsAPI,
  fetchSellerAuctionDetailsAPI,
  fetchTrashedAuctionsAPI
} from './service'
import { Auction, AuctionDetailsGet, AuctionPayload } from '~/app/features/auction/type'
import { APIError } from '~/app/features/error/type'
import { Page } from '~/app/features/page/type'
import { getUserRole2 } from '~/utils/helper'

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
      const isAdmin = getUserRole2() === 'ADMIN'
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

export const fetchTrashedAuctionsAsync = createAsyncThunk(
  'auction/fetchTrashedAuctionsAsync',
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
      const data = await fetchTrashedAuctionsAPI(pageNum, pageSize, keyword, sort, published)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const fetchAuctionDetailsAsync = createAsyncThunk(
  'auction/fetchAuctionDetailsAsync',
  async (id: number, thunkAPI) => {
    try {
      const isAdmin = getUserRole2() === 'ADMIN'
      if (isAdmin) {
        const data = await fetchAuctionDetailsAPI(id)
        return data
      } else {
        const data = await fetchSellerAuctionDetailsAPI(id)
        return data
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const createAuction = createAsyncThunk('auction/createAuction', async (payload: AuctionPayload, thunkAPI) => {
  try {
    const data = await createAuctionAPI(payload)
    return data
  } catch (error) {
    console.log(error)
    return thunkAPI.rejectWithValue(error)
  }
})

export interface AuctionState {
  auctionPage: Page<Auction>
  auctionDetailsGet: AuctionDetailsGet | null
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
  auctionDetailsGet: null,
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
      //createAuction
      .addCase(createAuction.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createAuction.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(createAuction.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as APIError
      })
      //fetchTrashedAuctionsAsync
      .addCase(fetchTrashedAuctionsAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchTrashedAuctionsAsync.fulfilled, (state, { payload }) => {
        state.auctionPage = payload
        state.isLoading = false
      })
      .addCase(fetchTrashedAuctionsAsync.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as APIError
      })
      //fetchAuctionDetailsAsync
      .addCase(fetchAuctionDetailsAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchAuctionDetailsAsync.fulfilled, (state, { payload }) => {
        state.auctionDetailsGet = payload
        state.isLoading = false
      })
      .addCase(fetchAuctionDetailsAsync.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as APIError
      })
  }
})

const auctionReducer = auctionSlice.reducer
export default auctionReducer
