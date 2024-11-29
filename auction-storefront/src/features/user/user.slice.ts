import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../store/type'
import { UserProfile } from '../../models/user.type'
import { getUserProfile, updateUserProfile } from './user.thunk'
import { getRolesFromToken } from '../../utils/helper'

export interface UserState {
  userProfile: UserProfile | null
  roles: string[]
  isFetching: boolean
  isLoading: boolean
}

const initialState: UserState = {
  userProfile: null,
  roles: [],
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
    setRoles(state, action) {
      if (action.payload) {
        state.roles = getRolesFromToken(action.payload)
        console.log(state.roles)
      } else {
        state.roles = []
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
export const { setUserProfile, setRoles } = userSlice.actions
