import { createSlice } from '@reduxjs/toolkit'
import {
  createAccountAPI,
  loginAPI,
  registerAPI,
  sendOTPAPI,
} from './auth.thunk'
import { APIErrorDetails } from '../../models/error.type'
import { RootState } from '../../store/type'

export interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: null | APIErrorDetails
  emailRegister: string
  isSendingOTP: boolean
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isLoading: false,
  error: null,
  emailRegister: '',
  isSendingOTP: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setError(state, action) {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      //registerAPI
      .addCase(registerAPI.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerAPI.fulfilled, (state, action) => {
        state.isLoading = false
        state.emailRegister = action.payload.email
      })
      .addCase(registerAPI.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as APIErrorDetails
      })
      //sendOTPAPI
      .addCase(sendOTPAPI.pending, (state) => {
        state.isSendingOTP = true
        state.error = null
      })
      .addCase(sendOTPAPI.fulfilled, (state) => {
        state.isSendingOTP = false
      })
      .addCase(sendOTPAPI.rejected, (state, { payload }) => {
        state.isSendingOTP = false
        state.error = payload as APIErrorDetails
      })
      //createAccountAPI
      .addCase(createAccountAPI.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createAccountAPI.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.accessToken = payload.accessToken
        state.refreshToken = payload.refreshToken
        localStorage.setItem('accessToken', payload.accessToken)
        localStorage.setItem('refreshToken', payload.refreshToken)
      })
      .addCase(createAccountAPI.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as APIErrorDetails
      })
      //loginAPI
      .addCase(loginAPI.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginAPI.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.accessToken = payload.accessToken
        state.refreshToken = payload.refreshToken
        localStorage.setItem('accessToken', payload.accessToken)
        localStorage.setItem('refreshToken', payload.refreshToken)
      })
      .addCase(loginAPI.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as APIErrorDetails
      })
  },
})

const authReducer = authSlice.reducer
export default authReducer
export const selectAuth = (state: RootState) => state.auth
export const { setError } = authSlice.actions
