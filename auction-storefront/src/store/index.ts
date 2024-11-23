import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/auth.slice'
import categoryReducer from '../features/category/category.slice'
import userReducer from '../features/user/user.slice'
import bidReducer from '../features/bid/bid.slice'
import walletReducer from '../features/wallet/wallet.slice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    user: userReducer,
    bid: bidReducer,
    wallet: walletReducer,
  },
})

export default store
