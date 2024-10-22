import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../store/type'
import { Category } from '../../models/category.type'
import { getListCategories } from './category.thunk'

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
    builder.addCase(getListCategories.fulfilled, (state, action) => {
      state.categories = action.payload
    })
  },
})

const categoryReducer = categorySlice.reducer
export default categoryReducer
export const selectCategory = (state: RootState) => state.category
