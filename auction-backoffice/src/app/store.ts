import { configureStore } from '@reduxjs/toolkit'
import authReducer from '~/features/auth.slice'
import categoryReducer from '~/features/category.slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
