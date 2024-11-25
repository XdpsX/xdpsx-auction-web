import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/slice'
import categoryReducer from '../features/category/slice'
import userReducer from '../features/user/user.slice'
import bidReducer from '../features/bid/slice'
import walletReducer from '../features/wallet/wallet.slice'
import notificationReducer from '../features/notification/slice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    user: userReducer,
    bid: bidReducer,
    wallet: walletReducer,
    notification: notificationReducer,
  },
})

export default store
