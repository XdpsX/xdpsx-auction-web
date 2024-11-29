import { Media } from '../../models/media.type'
import { SellerInfo, SellerProfilePayload } from '../../models/seller.type'
import { ProfilePayload, UserProfile } from '../../models/user.type'
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

export const fetchUserProfileAPI = async () => {
  try {
    const response = await api.get<UserProfile>('/storefront/users/me')
    return response.data
  } catch (error) {
    throw fromAxiosErrorToAPIError(error)
  }
}

export const updateUserProfileAPI = async (data: ProfilePayload) => {
  try {
    const response = await api.put<UserProfile>('/storefront/users/me', data)
    return response.data
  } catch (error) {
    throw fromAxiosErrorToAPIError(error)
  }
}

export const uploadSellerAvatarAPI = async (file: File): Promise<Media> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<Media>(
      '/storefront/sellers/upload',
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

export const registerSellerAPI = async (payload: SellerProfilePayload) => {
  try {
    const response = await api.post<SellerInfo>(
      '/storefront/sellers/register',
      payload
    )
    return response.data
  } catch (error) {
    throw fromAxiosErrorToAPIError(error)
  }
}
