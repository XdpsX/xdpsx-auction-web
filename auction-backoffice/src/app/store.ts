import { configureStore } from '@reduxjs/toolkit'
import authReducer from '~/features/auth.slice'
import categoryReducer from '~/features/category.slice'
import userReducer from '~/features/user.slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    category: categoryReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
