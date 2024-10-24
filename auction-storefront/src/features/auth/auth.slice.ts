import { createSlice } from '@reduxjs/toolkit'
import {
  createAccountAPI,
  loginAPI,
  logoutAPI,
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
    setToken(state, action) {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      localStorage.setItem('accessToken', action.payload.accessToken)
      localStorage.setItem('refreshToken', action.payload.refreshToken)
    },
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
        state.emailRegister = action.payload.email
        state.isLoading = false
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
      //logoutAPI
      .addCase(logoutAPI.fulfilled, (state) => {
        state.accessToken = null
        state.refreshToken = null
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      })
  },
})

const authReducer = authSlice.reducer
export default authReducer
export const selectAuth = (state: RootState) => state.auth
export const { setError, setToken } = authSlice.actions
