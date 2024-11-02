import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loginAPI } from '~/services/auth.service'
import { LoginPayload } from '~/types/auth'
import { APIError } from '~/types/error'

export const login = createAsyncThunk('auth/login', async (payload: LoginPayload, thunkAPI) => {
  try {
    const data = await loginAPI(payload)
    return data
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
  }
})

const authReducer = authSlice.reducer
export default authReducer
