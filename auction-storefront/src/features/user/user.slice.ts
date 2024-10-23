import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../store/type'
import { User } from '../../models/user.type'
import { getUserProfile } from './user.thunk'

export interface UserState {
  userProfile: User | null
  isFetching: boolean
}

const initialState: UserState = {
  userProfile: null,
  isFetching: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile(state, action) {
      state.userProfile = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.isFetching = true
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload
        state.isFetching = false
      })
      .addCase(getUserProfile.rejected, (state) => {
        state.isFetching = false
      })
  },
})

const userReducer = userSlice.reducer
export default userReducer
export const selectUser = (state: RootState) => state.user
export const { setUserProfile } = userSlice.actions
