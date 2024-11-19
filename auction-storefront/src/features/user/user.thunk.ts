import { createAsyncThunk } from '@reduxjs/toolkit'
import { fromAxiosErrorToAPIErrorDetails } from '../../utils/error.helper'
import { ProfilePayload, UserProfile } from '../../models/user.type'
import api from '../../utils/api'

export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async (_, thunkAPI) => {
    try {
      const response = await api.get<UserProfile>('/storefront/users/me')
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (data: ProfilePayload, thunkAPI) => {
    try {
      const response = await api.put<UserProfile>('/storefront/users/me', data)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)
