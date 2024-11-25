import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  createAccountAPI,
  loginAPI,
  logoutAPI,
  registerAPI,
  sendOTPAPI,
} from './service'
import { APIErrorDetails } from '../../models/error.type'
import { RootState } from '../../store/type'
import {
  AccountCreateRequest,
  LoginRequest,
  RegisterRequest,
} from '../../models/auth.type'
import { fromAxiosErrorToAPIErrorDetails } from '../../utils/error.helper'

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
      //registerAsync
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.emailRegister = action.payload.email
        state.isLoading = false
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as APIErrorDetails
      })
      //sendOTPAsync
      .addCase(sendOTPAsync.pending, (state) => {
        state.isSendingOTP = true
        state.error = null
      })
      .addCase(sendOTPAsync.fulfilled, (state) => {
        state.isSendingOTP = false
      })
      .addCase(sendOTPAsync.rejected, (state, { payload }) => {
        state.isSendingOTP = false
        state.error = payload as APIErrorDetails
      })
      //createAccountAsync
      .addCase(createAccountAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createAccountAsync.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.accessToken = payload.accessToken
        state.refreshToken = payload.refreshToken
        localStorage.setItem('accessToken', payload.accessToken)
        localStorage.setItem('refreshToken', payload.refreshToken)
      })
      .addCase(createAccountAsync.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as APIErrorDetails
      })
      //loginAsync
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginAsync.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.accessToken = payload.accessToken
        state.refreshToken = payload.refreshToken
        localStorage.setItem('accessToken', payload.accessToken)
        localStorage.setItem('refreshToken', payload.refreshToken)
      })
      .addCase(loginAsync.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as APIErrorDetails
      })
      //logoutAsync
      .addCase(logoutAsync.fulfilled, (state) => {
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

export const registerAsync = createAsyncThunk(
  'auth/registerAsync',
  async (payload: RegisterRequest, thunkAPI) => {
    try {
      const data = await registerAPI(payload)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)

export const sendOTPAsync = createAsyncThunk(
  'auth/sendOTPAsync',
  async (payload: { email: string }, thunkAPI) => {
    try {
      await sendOTPAPI(payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)

export const createAccountAsync = createAsyncThunk(
  'auth/createAccountAsync',
  async (payload: AccountCreateRequest, thunkAPI) => {
    try {
      const data = await createAccountAPI(payload)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)

export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async (payload: LoginRequest, thunkAPI) => {
    try {
      const data = await loginAPI(payload)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)

export const logoutAsync = createAsyncThunk(
  'auth/logoutAsync',
  async (_, thunkAPI) => {
    try {
      await logoutAPI()
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)
