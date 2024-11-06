import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'
import { fetchUserProfileAPI } from '~/app/features/user/service'
import { APIError } from '~/app/features/error/type'
import { User } from '~/app/features/user/type'

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
  roles: string[] | null
  isLoading: boolean
  error: null | APIError
}

const initialState: UserState = {
  profile: null,
  roles: null,
  isLoading: false,
  error: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, { payload }) => {
      state.profile = payload
    },
    setRoles: (state, { payload: accessToken }) => {
      if (!accessToken) {
        state.roles = null
        return
      }
      interface DecodedToken {
        scope: string
      }
      const decodedToken = jwtDecode<DecodedToken>(accessToken)
      const scope = decodedToken.scope
      state.roles = scope.split(' ')
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
export const { setProfile, setRoles } = userSlice.actions
