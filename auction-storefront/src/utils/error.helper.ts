import { AxiosError } from 'axios'
import { APIError, APIErrorDetails } from '../models/error.type'

export const fromAxiosErrorToAPIError = (error: unknown): APIError => {
  const axiosError = error as AxiosError
  const apiError = axiosError.response?.data as APIError
  return apiError || { status: 500, message: 'Internal Server Error' }
}

export const fromAxiosErrorToAPIErrorDetails = (
  error: unknown
): APIErrorDetails => {
  const axiosError = error as AxiosError
  const apiError = axiosError.response?.data as APIErrorDetails
  return apiError || { status: 500, message: 'Internal Server Error' }
}
