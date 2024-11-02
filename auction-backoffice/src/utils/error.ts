import { AxiosError } from 'axios'
import { APIError } from '~/types/error'

export const fromAxiosErrorToAPIError = (error: unknown): APIError => {
  const axiosError = error as AxiosError
  const apiError = axiosError.response?.data as APIError
  return apiError || { status: 500, message: 'Internal Server Error' }
}
