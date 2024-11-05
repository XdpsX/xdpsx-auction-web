import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchAllCategoriesAPI } from '~/services/category.service'
import { Category } from '~/types/category'
import { APIError } from '~/types/error'
import { Page } from '~/types/page'

export const fetchAllCategories = createAsyncThunk(
  'category/fetchAllCategories',
  async (
    {
      pageNum,
      pageSize,
      keyword,
      sort,
      hasPublished
    }: { pageNum: number; pageSize: number; keyword: string | null; sort: string; hasPublished: boolean | null },
    thunkAPI
  ) => {
    try {
      const data = await fetchAllCategoriesAPI(pageNum, pageSize, keyword, sort, hasPublished)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export interface CategoryState {
  categoryPage: Page<Category>
  isLoading: boolean
  error: null | APIError
}

const initialState: CategoryState = {
  categoryPage: {
    items: [],
    pageNum: 0,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0
  },
  isLoading: false,
  error: null
}

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //fetchAllCategories
      .addCase(fetchAllCategories.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchAllCategories.fulfilled, (state, { payload }) => {
        state.categoryPage = payload
        state.isLoading = false
      })
      .addCase(fetchAllCategories.rejected, (state, { payload }) => {
        state.error = payload as APIError
        state.isLoading = false
      })
  }
})

const categoryReducer = categorySlice.reducer
export default categoryReducer
