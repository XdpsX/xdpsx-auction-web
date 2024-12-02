import api from '~/utils/api'

export const fetchUserNotificationsAPI = async () => {
  const response = await api.get(`/backoffice/notifications`)
  return response.data
}

export const markNotificationAsReadAPI = async (notificationId: number) => {
  await api.put(`/backoffice/notifications/${notificationId}/read`)
}
