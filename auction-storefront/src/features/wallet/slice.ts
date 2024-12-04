import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  Wallet,
  Withdraw,
  WithdrawPayload,
  WithdrawStatusParam,
} from '../../models/wallet.type'
import { RootState } from '../../store/type'
import {
  cancelWithdrawAPI,
  createWithdrawAPI,
  fetchMyWalletAPI,
  fetchMyWithdrawalsAPI,
} from './service'
import { Page } from '../../models/page.type'

export interface WalletState {
  wallet: Wallet | null
  isLoading: boolean
  userWithdrawals: Page<Withdraw> | null
  isFetchingWithdrawals: boolean
  isCreatingWithdraw: boolean
}

const initialState: WalletState = {
  wallet: null,
  isLoading: false,
  userWithdrawals: null,
  isFetchingWithdrawals: false,
  isCreatingWithdraw: false,
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (state, action) => {
      state.wallet = action.payload
    },
    addBalance: (state, action) => {
      if (state.wallet) {
        state.wallet.balance = state.wallet.balance + action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //fetchMyWalletAsync
      .addCase(fetchMyWalletAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchMyWalletAsync.fulfilled, (state, action) => {
        state.wallet = action.payload
        state.isLoading = false
      })
      .addCase(fetchMyWalletAsync.rejected, (state) => {
        state.isLoading = false
      })
      //fetchMyWithdrawalsAsync
      .addCase(fetchMyWithdrawalsAsync.pending, (state) => {
        state.isFetchingWithdrawals = true
      })
      .addCase(fetchMyWithdrawalsAsync.fulfilled, (state, action) => {
        state.userWithdrawals = action.payload
        state.isFetchingWithdrawals = false
      })
      .addCase(fetchMyWithdrawalsAsync.rejected, (state) => {
        state.isFetchingWithdrawals = false
      })
      //createWithdrawAsync
      .addCase(createWithdrawAsync.pending, (state) => {
        state.isCreatingWithdraw = true
      })
      .addCase(createWithdrawAsync.fulfilled, (state) => {
        state.isCreatingWithdraw = false
      })
      .addCase(createWithdrawAsync.rejected, (state) => {
        state.isCreatingWithdraw = false
      })
      //cancelWithdrawAsync
      .addCase(cancelWithdrawAsync.pending, (state) => {
        state.isFetchingWithdrawals = true
      })
      .addCase(cancelWithdrawAsync.fulfilled, (state, action) => {
        state.isFetchingWithdrawals = false
        if (state.userWithdrawals) {
          state.userWithdrawals.items = state.userWithdrawals.items.map(
            (item) =>
              item.id === action.payload
                ? { ...item, status: 'CANCELLED' }
                : item
          )
        }
      })
      .addCase(cancelWithdrawAsync.rejected, (state) => {
        state.isFetchingWithdrawals = false
      })
  },
})

const walletReducer = walletSlice.reducer
export default walletReducer
export const selectWallet = (state: RootState) => state.wallet
export const { setWallet, addBalance } = walletSlice.actions

export const fetchMyWalletAsync = createAsyncThunk(
  'wallet/fetchMyWalletAsync',
  async () => {
    const data = await fetchMyWalletAPI()
    return data
  }
)

export const fetchMyWithdrawalsAsync = createAsyncThunk(
  'wallet/fetchMyWithdrawalsAsync',
  async ({
    pageNum,
    pageSize,
    sort,
    status,
  }: {
    pageNum: number
    pageSize: number
    sort: string
    status: WithdrawStatusParam | null
  }) => {
    const data = await fetchMyWithdrawalsAPI(pageNum, pageSize, sort, status)
    return data
  }
)

export const createWithdrawAsync = createAsyncThunk(
  'wallet/createWithdrawAsync',
  async (payload: WithdrawPayload) => {
    const data = await createWithdrawAPI(payload)
    return data
  }
)

export const cancelWithdrawAsync = createAsyncThunk(
  'wallet/cancelWithdrawAsync',
  async (id: number) => {
    await cancelWithdrawAPI(id)
    return id
  }
)
