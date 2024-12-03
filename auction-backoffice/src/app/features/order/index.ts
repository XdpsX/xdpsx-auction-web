import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from '../page/type'
import { Order, OrderStatus } from './type'
import { fetchMyOrdersAPI, updateOrderStatusAPI } from './service'

export interface OrderState {
  sellerOrder: Page<Order> | null
  isLoading: boolean
}

const initialState: OrderState = {
  sellerOrder: null,
  isLoading: false
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchMyOrdersAsync
    builder.addCase(fetchMyOrdersAsync.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchMyOrdersAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.sellerOrder = action.payload
    })
    builder.addCase(fetchMyOrdersAsync.rejected, (state) => {
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
  }
})

const orderReducer = orderSlice.reducer
export default orderReducer

export const fetchMyOrdersAsync = createAsyncThunk(
  'order/fetchMyOrdersAsync',
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
    const data = await fetchMyOrdersAPI(pageNum, pageSize, keyword, sort, status)
    return data
  }
)

export const updateOrderStatusAsync = createAsyncThunk('order/updateOrderStatusAsync', async (orderId: number) => {
  const data = await updateOrderStatusAPI(orderId)
  return data
})
