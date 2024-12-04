import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from '../page/type'
import { Withdraw } from './type'
import { fetchWithdrawalsAPI } from './service'

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
  }
})

const withdrawalReducer = withdrawalSlice.reducer
export default withdrawalReducer

export const fetchWithdrawalsAsync = createAsyncThunk(
  'withdrawal/fetchWithdrawalsAsync',
  async ({
    pageNum,
    pageSize,
    sort,
    statuses
  }: {
    pageNum: number
    pageSize: number
    sort: string
    statuses: string
  }) => {
    const data = await fetchWithdrawalsAPI(pageNum, pageSize, sort, statuses)
    return data
  }
)
