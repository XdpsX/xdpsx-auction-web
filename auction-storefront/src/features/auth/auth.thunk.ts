import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  AccountCreateRequest,
  LoginRequest,
  RegisterRequest,
} from '../../models/auth.type'
import { Token } from '../../models/token.type'
import { fromAxiosErrorToAPIErrorDetails } from '../../utils/error.helper'
import api from '../../utils/api'

export const registerAPI = createAsyncThunk(
  'auth/registerAPI',
  async (payload: RegisterRequest, thunkAPI) => {
    try {
      const response = await api.post('/auth/register', payload)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)

export const sendOTPAPI = createAsyncThunk(
  'auth/sendOTPAPI',
  async (payload: { email: string }, thunkAPI) => {
    try {
      await api.post('/otp-mail/send', payload)
      return
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)

export const createAccountAPI = createAsyncThunk(
  'auth/createAccountAPI',
  async (payload: AccountCreateRequest, thunkAPI) => {
    try {
      const response = await api.post<Token>('/auth/create-account', payload)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)

export const loginAPI = createAsyncThunk(
  'auth/loginAPI',
  async (payload: LoginRequest, thunkAPI) => {
    try {
      const response = await api.post<Token>('/auth/login', payload)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)

export const logoutAPI = createAsyncThunk(
  'auth/logoutAPI',
  async (_, thunkAPI) => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)
