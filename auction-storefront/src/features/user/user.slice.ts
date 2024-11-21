import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../store/type'
import { UserProfile } from '../../models/user.type'
import { getUserProfile, updateUserProfile } from './user.thunk'

export interface UserState {
  userProfile: UserProfile | null
  isFetching: boolean
  isLoading: boolean
}

const initialState: UserState = {
  userProfile: null,
  isFetching: false,
  isLoading: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile(state, action) {
      state.userProfile = action.payload
    },
    addBalance(state, action) {
      if (state.userProfile) {
        state.userProfile.balance += action.payload
      }
    },
    subtractBalance(state, action) {
      if (state.userProfile) {
        state.userProfile.balance -= action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //getUserProfile
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
      //updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload
        state.isLoading = false
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.isLoading = false
      })
  },
})

const userReducer = userSlice.reducer
export default userReducer
export const selectUser = (state: RootState) => state.user
export const { setUserProfile, addBalance, subtractBalance } = userSlice.actions
