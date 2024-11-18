import { Media } from '../../models/media.type'
import api from '../../utils/api'
import { fromAxiosErrorToAPIError } from '../../utils/error.helper'

export const uploadUserAvatarAPI = async (file: File): Promise<Media> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<Media>(
      '/storefront/users/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  } catch (error) {
    throw fromAxiosErrorToAPIError(error)
  }
}
