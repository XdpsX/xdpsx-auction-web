import { configureStore } from '@reduxjs/toolkit'
import auctionReducer from './features/auction'
import authReducer from './features/auth'
import categoryReducer from './features/category'
import userReducer from './features/user'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    category: categoryReducer,
    auction: auctionReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
