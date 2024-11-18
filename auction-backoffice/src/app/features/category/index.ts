import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchAllCategoriesAPI, fetchPublishedCategoriesAPI } from './service'
import { Category } from '~/app/features/category/type'
import { APIError } from '~/app/features/error/type'
import { Page } from '~/app/features/page/type'

export const fetchAllCategories = createAsyncThunk(
  'category/fetchAllCategories',
  async (
    {
      pageNum,
      pageSize,
      keyword,
      sort,
      published
    }: { pageNum: number; pageSize: number; keyword: string | null; sort: string; published: boolean | null },
    thunkAPI
  ) => {
    try {
      const data = await fetchAllCategoriesAPI(pageNum, pageSize, keyword, sort, published)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const fetchPublishedCategories = createAsyncThunk('category/fetchPublishedCategories', async (_, thunkAPI) => {
  try {
    const data = await fetchPublishedCategoriesAPI()
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export interface CategoryState {
  categoryPage: Page<Category>
  categories: Category[]
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
  categories: [],
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
      //fetchPublishedCategories
      .addCase(fetchPublishedCategories.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchPublishedCategories.fulfilled, (state, { payload }) => {
        state.categories = payload
        state.isLoading = false
      })
      .addCase(fetchPublishedCategories.rejected, (state, { payload }) => {
        state.error = payload as APIError
        state.isLoading = false
      })
  }
})

const categoryReducer = categorySlice.reducer
export default categoryReducer
