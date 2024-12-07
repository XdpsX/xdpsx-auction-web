import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../store/type'
import { fromAxiosErrorToAPIErrorDetails } from '../../utils/error.helper'
import {
  cancelOrderAPI,
  confirmOrderAPI,
  createOrderAPI,
  fetchMyOrdersAPI,
  fetchOrderDetailsAPI,
} from './service'
import { Page } from '../../models/page.type'
import {
  Order,
  OrderStatus,
  CreateOrderPayload,
  OrderDetails,
} from '../../models/order.type'

export interface OrderState {
  userOrder: Page<Order> | null
  orderDetails: OrderDetails | null
  isLoading: boolean
}

const initialState: OrderState = {
  userOrder: null,
  orderDetails: null,
  isLoading: false,
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
      state.userOrder = action.payload
    })
    builder.addCase(fetchMyOrdersAsync.rejected, (state) => {
      state.isLoading = false
    })
    // cancelOrderAsync
    builder.addCase(cancelOrderAsync.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(cancelOrderAsync.fulfilled, (state, action) => {
      state.isLoading = false
      if (state.userOrder) {
        state.userOrder.items = state.userOrder.items.filter(
          (order) => order.id !== action.payload.id
        )
      }
    })
    builder.addCase(cancelOrderAsync.rejected, (state) => {
      state.isLoading = false
    })
    // confirmOrderAsync
    builder.addCase(confirmOrderAsync.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(confirmOrderAsync.fulfilled, (state, action) => {
      state.isLoading = false
      if (state.userOrder) {
        state.userOrder.items = state.userOrder.items.filter(
          (order) => order.id !== action.payload.id
        )
      }
    })
    builder.addCase(confirmOrderAsync.rejected, (state) => {
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
  },
})

const orderReducer = orderSlice.reducer
export default orderReducer
export const selectOrder = (state: RootState) => state.order

export const fetchMyOrdersAsync = createAsyncThunk(
  'order/fetchMyOrdersAsync',
  async (
    {
      pageNum,
      pageSize,
      keyword,
      sort,
      status,
    }: {
      pageNum: number
      pageSize: number
      keyword: string | null
      sort: string
      status: OrderStatus
    },
    thunkAPI
  ) => {
    try {
      const data = await fetchMyOrdersAPI(
        pageNum,
        pageSize,
        keyword,
        sort,
        status
      )
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)

export const cancelOrderAsync = createAsyncThunk(
  'order/cancelOrderAsync',
  async (orderId: number, thunkAPI) => {
    try {
      const data = await cancelOrderAPI(orderId)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)

export const confirmOrderAsync = createAsyncThunk(
  'order/confirmOrderAsync',
  async (orderId: number, thunkAPI) => {
    try {
      const data = await confirmOrderAPI(orderId)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)

export const createOrderAsync = createAsyncThunk(
  'order/createOrderAsync',
  async (payload: CreateOrderPayload, thunkAPI) => {
    try {
      const data = await createOrderAPI(payload)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)

export const fetchOrderDetailsAsync = createAsyncThunk(
  'order/fetchOrderDetailsAsync',
  async (orderId: number, thunkAPI) => {
    try {
      const data = await fetchOrderDetailsAPI(orderId)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)
