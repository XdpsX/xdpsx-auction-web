import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from '../page/type'
import { RootState } from '~/app/store'
import { fetchUserNotificationsAPI, markNotificationAsReadAPI } from './service'
import { type Notification } from './type'

export interface NotificationState {
  notifications: Page<Notification> | null
  unreadCount: number
}

const initialState: NotificationState = {
  notifications: null,
  unreadCount: 0
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserNotificationsAsync.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications
        state.unreadCount = action.payload.unreadCount
      })
      .addCase(markNotificationAsReadAsync.fulfilled, (state, action) => {
        const notification = state.notifications?.items.find((n) => n.id === action.payload)
        if (notification) {
          notification.isRead = true
          state.unreadCount -= 1
        }
      })
  }
})

const notificationReducer = notificationSlice.reducer
export default notificationReducer
export const selectNotification = (state: RootState) => state.notification
export const { addNotification } = notificationSlice.actions

export const fetchUserNotificationsAsync = createAsyncThunk('notification/fetchUserNotificationsAsync', async () => {
  const data = await fetchUserNotificationsAPI()
  return data
})

export const markNotificationAsReadAsync = createAsyncThunk(
  'notification/markNotificationAsReadAsync',
  async (notificationId: number) => {
    await markNotificationAsReadAPI(notificationId)
    return notificationId
  }
)
