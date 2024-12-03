import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from '../../models/page.type'
import { Transaction } from '../../models/transaction.type'
import { RootState } from '../../store/type'
import { fetchMyTransactionsAPI } from './service'

export interface TransactionState {
  userTransactions: Page<Transaction> | null
  isLoading: boolean
}

const initialState: TransactionState = {
  userTransactions: null,
  isLoading: false,
}

export const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchMyTransactionsAsync
    builder.addCase(fetchMyTransactionsAsync.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchMyTransactionsAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.userTransactions = action.payload
    })
    builder.addCase(fetchMyTransactionsAsync.rejected, (state) => {
      state.isLoading = false
    })
  },
})

const transactionReducer = transactionSlice.reducer
export default transactionReducer
export const selectTransaction = (state: RootState) => state.transaction

export const fetchMyTransactionsAsync = createAsyncThunk(
  'transactions/fetchMyTransactionsAsync',
  async ({
    pageNum,
    pageSize,
    sort,
    type,
  }: {
    pageNum: number
    pageSize: number
    sort: string
    type: string | null
  }) => {
    const data = await fetchMyTransactionsAPI(pageNum, pageSize, sort, type)
    return data
  }
)
