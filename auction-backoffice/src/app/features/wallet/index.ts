import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { fetchMyWalletAPI } from './service'
import { Wallet } from './type'

export interface WalletState {
  wallet: Wallet | null
  isLoading: boolean
}

const initialState: WalletState = {
  wallet: null,
  isLoading: false
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (state, action) => {
      state.wallet = action.payload
    }
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
  }
})

const walletReducer = walletSlice.reducer
export default walletReducer
export const { setWallet } = walletSlice.actions

export const fetchMyWalletAsync = createAsyncThunk('wallet/fetchMyWalletAsync', async () => {
  const data = await fetchMyWalletAPI()
  return data
})
