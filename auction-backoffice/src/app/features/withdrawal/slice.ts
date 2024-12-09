import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from '../page/type'
import { UpdateWithdrawStatusPayload, Withdraw, WithdrawPayload, WithdrawStatusParam } from './type'
import {
  cancelWithdrawAPI,
  createWithdrawAPI,
  fetchListWithdrawalsAPI,
  fetchMyWithdrawalRequest,
  fetchRequestWithdrawalsAPI,
  updateWithdrawStatusAPI
} from './service'
import { getUserRole2 } from '~/utils/helper'
import { toast } from 'react-toastify'
import { APIError } from '../error/type'

export interface WithdrawalState {
  isLoading: boolean
  withdrawals: Page<Withdraw> | null
}

const initialState: WithdrawalState = {
  isLoading: false,
  withdrawals: null
}

export const withdrawalSlice = createSlice({
  name: 'withdrawal',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //fetchWithdrawalsAsync
      .addCase(fetchWithdrawalsAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchWithdrawalsAsync.fulfilled, (state, action) => {
        state.withdrawals = action.payload
        state.isLoading = false
      })
      .addCase(fetchWithdrawalsAsync.rejected, (state) => {
        state.isLoading = false
      })
      //updateWithdrawStatusAsync
      .addCase(updateWithdrawStatusAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateWithdrawStatusAsync.fulfilled, (state, action) => {
        if (state.withdrawals && action.payload) {
          const updatedWithdraw = state.withdrawals.items.find((withdraw) => withdraw.id === action.payload?.id)
          if (updatedWithdraw) {
            updatedWithdraw.status = action.payload.status
            updatedWithdraw.reason = action.payload.reason
          }
        }
        state.isLoading = false
      })
      .addCase(updateWithdrawStatusAsync.rejected, (state) => {
        state.isLoading = false
      })
      //createWithdrawAsync
      .addCase(createWithdrawAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createWithdrawAsync.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(createWithdrawAsync.rejected, (state) => {
        state.isLoading = false
      })
      //cancelWithdrawAsync
      .addCase(cancelWithdrawAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(cancelWithdrawAsync.fulfilled, (state, action) => {
        state.isLoading = false
        if (state.withdrawals) {
          state.withdrawals.items = state.withdrawals.items.map((item) =>
            item.id === action.payload ? { ...item, status: 'CANCELLED' } : item
          )
        }
      })
      .addCase(cancelWithdrawAsync.rejected, (state) => {
        state.isLoading = false
      })
  }
})

const withdrawalReducer = withdrawalSlice.reducer
export default withdrawalReducer

export const fetchWithdrawalsAsync = createAsyncThunk(
  'withdrawal/fetchWithdrawalsAsync',
  async ({
    page,
    pageNum,
    pageSize,
    sort,
    status
  }: {
    page: 'list' | 'request-list'
    pageNum: number
    pageSize: number
    sort: string
    status: WithdrawStatusParam | null
  }) => {
    if (page === 'list') {
      const isAdmin = getUserRole2() === 'ADMIN'
      if (isAdmin) {
        return await fetchListWithdrawalsAPI(pageNum, pageSize, sort, status)
      } else {
        return await fetchMyWithdrawalRequest(pageNum, pageSize, sort, status)
      }
    } else {
      return await fetchRequestWithdrawalsAPI(pageNum, pageSize, sort, status)
    }
  }
)

export const updateWithdrawStatusAsync = createAsyncThunk(
  'withdrawal/updateWithdrawStatusAsync',
  async ({ withdrawId, payload }: { withdrawId: number; payload: UpdateWithdrawStatusPayload }, thunkAPI) => {
    try {
      const data = await updateWithdrawStatusAPI(withdrawId, payload)
      return data
    } catch (error) {
      thunkAPI.rejectWithValue(error)
    }
  }
)

export const createWithdrawAsync = createAsyncThunk(
  'wallet/createWithdrawAsync',
  async (payload: WithdrawPayload, thunkAPI) => {
    try {
      const data = await createWithdrawAPI(payload)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const cancelWithdrawAsync = createAsyncThunk('wallet/cancelWithdrawAsync', async (id: number, thunkAPI) => {
  try {
    await cancelWithdrawAPI(id)
    return id
  } catch (error) {
    const err = error as APIError
    toast.error(err.message || 'Cancel withdraw failed')
    return thunkAPI.rejectWithValue(error)
  }
})
