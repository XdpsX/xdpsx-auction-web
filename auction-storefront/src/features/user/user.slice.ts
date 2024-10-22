import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../store/type'
import { User } from '../../models/user.type'
import { getUserProfile } from './user.thunk'

export interface UserState {
  userProfile: User | null
}

const initialState: UserState = {
  userProfile: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.userProfile = action.payload
    })
  },
})

const userReducer = userSlice.reducer
export default userReducer
export const selectUser = (state: RootState) => state.user
