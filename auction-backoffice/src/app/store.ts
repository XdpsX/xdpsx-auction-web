import { configureStore } from '@reduxjs/toolkit'
import auctionReducer from './features/auction'
import authReducer from './features/auth'
import categoryReducer from './features/category'
import userReducer from './features/user'
import sellerReducer from './features/seller'
import notificationReducer from './features/notification'
import orderReducer from './features/order'
import withdrawalReducer from './features/withdrawal/slice'
import walletReducer from './features/wallet'
import reportReducer from './features/report'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    category: categoryReducer,
    auction: auctionReducer,
    seller: sellerReducer,
    notification: notificationReducer,
    order: orderReducer,
    withdrawal: withdrawalReducer,
    wallet: walletReducer,
    report: reportReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
