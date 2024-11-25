import api from '../../utils/api'

export const fetchUserNotificaitonsAPI = async () => {
  const response = await api.get(`/storefront/notifications`)
  return response.data
}

export const markNotificaitonAsReadAPI = async (notificationId: number) => {
  await api.put(`/storefront/notifications/${notificationId}/read`)
  return notificationId
}
