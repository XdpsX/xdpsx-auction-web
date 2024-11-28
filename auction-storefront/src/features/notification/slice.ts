import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Notification } from '../../models/notification.type'
import { RootState } from '../../store/type'
import { Page } from '../../models/page.type'
import { fetchUserNotificaitonsAPI, markNotificaitonAsReadAPI } from './service'

export interface NotificationState {
  notifications: Page<Notification> | null
  unreadCount: number
}

const initialState: NotificationState = {
  notifications: null,
  unreadCount: 0,
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      if (state.notifications) {
        // state.notifications.items.unshift(action.payload)
        state.notifications.items.unshift(action.payload)
        if (state.notifications.items.length > state.notifications.pageSize) {
          state.notifications.items.pop()
        }
        state.unreadCount += 1
        state.notifications.totalItems += 1
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserNotificaitonsAsync.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications
        state.unreadCount = action.payload.unreadCount
      })
      .addCase(markNotificaitonAsReadAsync.fulfilled, (state, action) => {
        const notification = state.notifications?.items.find(
          (n) => n.id === action.payload
        )
        if (notification) {
          notification.isRead = true
          state.unreadCount -= 1
        }
      })
  },
})

const notificationReducer = notificationSlice.reducer
export default notificationReducer
export const selectNotification = (state: RootState) => state.notification
export const { addNotification } = notificationSlice.actions

export const fetchUserNotificaitonsAsync = createAsyncThunk(
  'notification/fetchUserNotificaitonsAsync',
  async () => {
    const data = await fetchUserNotificaitonsAPI()
    return data
  }
)

export const markNotificaitonAsReadAsync = createAsyncThunk(
  'notification/markNotificaitonAsReadAsync',
  async (notificationId: number) => {
    await markNotificaitonAsReadAPI(notificationId)
    return notificationId
  }
)
