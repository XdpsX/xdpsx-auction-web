import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/auth.slice'
import categoryReducer from '../features/category/category.slice'
import userReducer from '../features/user/user.slice'
import bidReducer from '../features/bid/bid.slice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    user: userReducer,
    bid: bidReducer,
  },
})

export default store
