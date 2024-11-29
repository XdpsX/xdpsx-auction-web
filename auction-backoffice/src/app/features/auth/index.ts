import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loginAPI, logoutAPI } from './service'
import { LoginPayload } from '~/app/features/auth/type'
import { APIError } from '~/app/features/error/type'
import { getRolesFromToken } from '~/utils/helper'

export const login = createAsyncThunk('auth/login', async (payload: LoginPayload, thunkAPI) => {
  try {
    const data = await loginAPI(payload)
    const roles = getRolesFromToken(data.accessToken)
    if (!roles.includes('SELLER') && !roles.includes('ADMIN')) {
      return thunkAPI.rejectWithValue({ status: 403, message: 'You are not authorized to access this page' })
    }
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await logoutAPI()
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: null | APIError
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isLoading: false,
  error: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //loginAPI
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.accessToken = payload.accessToken
        state.refreshToken = payload.refreshToken
        localStorage.setItem('accessToken', payload.accessToken)
        localStorage.setItem('refreshToken', payload.refreshToken)
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as APIError
      })
      //logoutAPI
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null
        state.refreshToken = null
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      })
  }
})

const authReducer = authSlice.reducer
export default authReducer
