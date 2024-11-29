import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from '../page/type'
import { SellerProfile } from './type'
import { fetchSellersAPI, updateSellerStatusAPI } from './service'

export interface SellerState {
  sellerPage: Page<SellerProfile> | null
  isLoading: boolean
}

const initialState: SellerState = {
  sellerPage: null,
  isLoading: false
}

export const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //fetchSellersAsync
      .addCase(fetchSellersAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchSellersAsync.fulfilled, (state, { payload }) => {
        state.sellerPage = payload
        state.isLoading = false
      })
      .addCase(fetchSellersAsync.rejected, (state) => {
        state.isLoading = false
      })
      //updateSellerStatusAsync
      .addCase(updateSellerStatusAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateSellerStatusAsync.fulfilled, (state, { payload }) => {
        if (state.sellerPage && state.sellerPage.items) {
          state.sellerPage.items = state.sellerPage.items.map((seller) => (seller.id === payload.id ? payload : seller))
        }
        state.isLoading = false
      })
      .addCase(updateSellerStatusAsync.rejected, (state) => {
        state.isLoading = false
      })
  }
})

const sellerReducer = sellerSlice.reducer
export default sellerReducer

export const fetchSellersAsync = createAsyncThunk(
  'seller/fetchSellersAsync',
  async (
    {
      pageNum,
      pageSize,
      keyword,
      sort,
      status
    }: {
      pageNum: number
      pageSize: number
      keyword: string | null
      sort: string
      status: string | null
    },
    thunkAPI
  ) => {
    try {
      const data = await fetchSellersAPI(pageNum, pageSize, keyword, sort, status)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const updateSellerStatusAsync = createAsyncThunk(
  'seller/updateSellerStatusAsync',
  async (
    {
      sellerId,
      status
    }: {
      sellerId: number
      status: string
    },
    thunkAPI
  ) => {
    try {
      const data = await updateSellerStatusAPI(sellerId, status)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
