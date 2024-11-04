import { AxiosError } from 'axios'
import { APIError } from '~/types/error'

export const convertAxiosErrorToAPIError = (error: unknown): APIError => {
  const axiosError = error as AxiosError
  const apiError = axiosError.response?.data as APIError
  return apiError || { status: 500, message: 'Internal Server Error' }
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
