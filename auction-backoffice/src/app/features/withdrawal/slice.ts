import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from '../page/type'
import { UpdateWithdrawStatusPayload, Withdraw, WithdrawStatusParam } from './type'
import { fetchListWithdrawalsAPI, fetchRequestWithdrawalsAPI, updateWithdrawStatusAPI } from './service'

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
      return await fetchListWithdrawalsAPI(pageNum, pageSize, sort, status)
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
