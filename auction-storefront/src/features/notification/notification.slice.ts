import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Notification } from '../../models/notification.type'
import { RootState } from '../../store/type'
import api from '../../utils/api'
import { Page } from '../../models/page.type'

export const fetchUserNotificaitons = createAsyncThunk(
  'notification/fetchUserNotificaitons',
  async () => {
    const response = await api.get(`/storefront/notifications`)
    return response.data
  }
)

export const markNotificaitonAsRead = createAsyncThunk(
  'notification/markNotificaitonAsRead',
  async (notificationId: number) => {
    await api.put(`/storefront/notifications/${notificationId}/read`)
    return notificationId
  }
)

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
      .addCase(fetchUserNotificaitons.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications
        state.unreadCount = action.payload.unreadCount
      })
      .addCase(markNotificaitonAsRead.fulfilled, (state, action) => {
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
