import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchUserProfileAPI } from '~/services/user.service'
import { APIError } from '~/types/error'
import { User } from '~/types/user'

export const fetchUserProfile = createAsyncThunk('user/fetchUserProfile', async (_, thunkAPI) => {
  try {
    const data = await fetchUserProfileAPI()
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export interface UserState {
  profile: User | null
  role: 'USER' | 'ADMIN' | 'SELLER' | null
  isLoading: boolean
  error: null | APIError
}

const initialState: UserState = {
  profile: null,
  role: null,
  isLoading: false,
  error: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, { payload }) => {
      state.profile = payload
    }
  },
  extraReducers: (builder) => {
    builder
      //fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchUserProfile.fulfilled, (state, { payload }) => {
        state.profile = payload
        state.isLoading = false
      })
      .addCase(fetchUserProfile.rejected, (state, { payload }) => {
        state.error = payload as APIError
        state.isLoading = false
      })
  }
})

const userReducer = userSlice.reducer
export default userReducer
export const { setProfile } = userSlice.actions
