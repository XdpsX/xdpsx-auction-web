import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../store/type'
import { Category } from '../../models/category.type'
import { getListCategoriesAPI } from './service'
import { fromAxiosErrorToAPIErrorDetails } from '../../utils/error.helper'

export interface CategoryState {
  categories: Category[]
}

const initialState: CategoryState = {
  categories: [],
}

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListCategoriesAsync.fulfilled, (state, action) => {
      state.categories = action.payload
    })
  },
})

const categoryReducer = categorySlice.reducer
export default categoryReducer
export const selectCategory = (state: RootState) => state.category

export const getListCategoriesAsync = createAsyncThunk(
  'category/getListCategoriesAsync',
  async (_, thunkAPI) => {
    try {
      const data = await getListCategoriesAPI()
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(fromAxiosErrorToAPIErrorDetails(error))
    }
  }
)
