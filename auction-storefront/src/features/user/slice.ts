import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../store/type'
import { ProfilePayload, UserProfile } from '../../models/user.type'
import { getRolesFromToken } from '../../utils/helper'
import {
  fetchUserProfileAPI,
  registerSellerAPI,
  updateUserProfileAPI,
} from './service'
import { SellerProfilePayload } from '../../models/seller.type'

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
      } else {
        state.roles = []
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //fetchUserProfileAsync
      .addCase(fetchUserProfileAsync.pending, (state) => {
        state.isFetching = true
      })
      .addCase(fetchUserProfileAsync.fulfilled, (state, action) => {
        state.userProfile = action.payload
        state.isFetching = false
      })
      .addCase(fetchUserProfileAsync.rejected, (state) => {
        state.isFetching = false
      })
      //updateUserProfileAsync
      .addCase(updateUserProfileAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateUserProfileAsync.fulfilled, (state, action) => {
        state.userProfile = action.payload
        state.isLoading = false
      })
      .addCase(updateUserProfileAsync.rejected, (state) => {
        state.isLoading = false
      })
      //registerSellerAsync
      .addCase(registerSellerAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(registerSellerAsync.fulfilled, (state, action) => {
        if (state.userProfile) {
          console.log('first')
          console.log(action.payload)
          state.userProfile.sellerDetails = action.payload
        }
        state.isLoading = false
      })
      .addCase(registerSellerAsync.rejected, (state) => {
        state.isLoading = false
      })
  },
})

const userReducer = userSlice.reducer
export default userReducer
export const selectUser = (state: RootState) => state.user
export const { setUserProfile, setRoles } = userSlice.actions

export const fetchUserProfileAsync = createAsyncThunk(
  'user/fetchUserProfileAsync',
  async (_, thunkAPI) => {
    try {
      const data = await fetchUserProfileAPI()
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const updateUserProfileAsync = createAsyncThunk(
  'user/updateUserProfileAsync',
  async (payload: ProfilePayload, thunkAPI) => {
    try {
      const data = await updateUserProfileAPI(payload)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const registerSellerAsync = createAsyncThunk(
  'user/registerSellerAsync',
  async (payload: SellerProfilePayload, thunkAPI) => {
    try {
      const data = await registerSellerAPI(payload)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
