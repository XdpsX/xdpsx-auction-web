import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from '../page/type'
import { Order, OrderDetails, OrderStatus } from './type'
import {
  fetchMyOrdersAPI,
  fetchOrderDetailsAPI,
  fetchOrdersAPI,
  fetchSellerOrderDetailsAPI,
  updateOrderStatusAPI
} from './service'
import { getUserRole2 } from '~/utils/helper'

export interface OrderState {
  sellerOrder: Page<Order> | null
  orderDetails: OrderDetails | null
  isLoading: boolean
}

const initialState: OrderState = {
  sellerOrder: null,
  orderDetails: null,
  isLoading: false
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchOrdersAsync
    builder.addCase(fetchOrdersAsync.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchOrdersAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.sellerOrder = action.payload
    })
    builder.addCase(fetchOrdersAsync.rejected, (state) => {
      state.isLoading = false
    })
    // updateOrderStatusAsync
    builder.addCase(updateOrderStatusAsync.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(updateOrderStatusAsync.fulfilled, (state, action) => {
      state.isLoading = false
      if (state.sellerOrder) {
        state.sellerOrder.items = state.sellerOrder.items.filter((order) => order.id !== action.payload.id)
      }
    })
    builder.addCase(updateOrderStatusAsync.rejected, (state) => {
      state.isLoading = false
    })
    // fetchOrderDetailsAsync
    builder.addCase(fetchOrderDetailsAsync.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchOrderDetailsAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.orderDetails = action.payload
    })
    builder.addCase(fetchOrderDetailsAsync.rejected, (state) => {
      state.isLoading = false
    })
  }
})

const orderReducer = orderSlice.reducer
export default orderReducer

export const fetchOrdersAsync = createAsyncThunk(
  'order/fetchOrdersAsync',
  async ({
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
    status: OrderStatus
  }) => {
    const isAdmin = getUserRole2() === 'ADMIN'
    if (isAdmin) {
      const data = await fetchOrdersAPI(pageNum, pageSize, keyword, sort, status)
      return data
    } else {
      const data = await fetchMyOrdersAPI(pageNum, pageSize, keyword, sort, status)
      return data
    }
  }
)

export const fetchOrderDetailsAsync = createAsyncThunk(
  'order/fetchOrderDetailsAsync',
  async (orderId: number, thunkAPI) => {
    try {
      const isAdmin = getUserRole2() === 'ADMIN'
      if (isAdmin) {
        const data = await fetchOrderDetailsAPI(orderId)
        return data
      } else {
        const data = await fetchSellerOrderDetailsAPI(orderId)
        return data
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const updateOrderStatusAsync = createAsyncThunk('order/updateOrderStatusAsync', async (orderId: number) => {
  const data = await updateOrderStatusAPI(orderId)
  return data
})
