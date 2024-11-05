import { configureStore } from '@reduxjs/toolkit'
import auctionReducer from '~/features/auction.slice'
import authReducer from '~/features/auth.slice'
import categoryReducer from '~/features/category.slice'
import userReducer from '~/features/user.slice'

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
