import { createAsyncThunk } from '@reduxjs/toolkit'
import { fromAxiosErrorToAPIErrorDetails } from '../../utils/error.helper'
import { Category } from '../../models/category.type'
import api from '../../utils/api'

export const getListCategories = createAsyncThunk(
  'category/getListCategories',
  async (_, thunkAPI) => {
    try {
      const response = await api.get<Category[]>('/storefront/categories')
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)
