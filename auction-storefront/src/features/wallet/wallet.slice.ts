import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { APIErrorDetails } from '../../models/error.type'
import { Wallet } from '../../models/wallet.type'
import api from '../../utils/api'
import { fromAxiosErrorToAPIErrorDetails } from '../../utils/error.helper'
import { RootState } from '../../store/type'

export const getUserWallet = createAsyncThunk(
  'wallet/getUserWallet',
  async (_, thunkAPI) => {
    try {
      const response = await api.get<Wallet>('/storefront/wallets/me')
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)

export interface WalletState {
  wallet: Wallet | null
  isLoading: boolean
  error: null | APIErrorDetails
}

const initialState: WalletState = {
  wallet: null,
  isLoading: false,
  error: null,
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
      //getUserWallet
      .addCase(getUserWallet.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUserWallet.fulfilled, (state, action) => {
        state.wallet = action.payload
        state.isLoading = false
      })
      .addCase(getUserWallet.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as APIErrorDetails
      })
  },
})

const walletReducer = walletSlice.reducer
export default walletReducer
export const selectWallet = (state: RootState) => state.wallet
export const { setWallet, addBalance } = walletSlice.actions
