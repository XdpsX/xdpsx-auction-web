import { AxiosError } from 'axios'
import { createSearchParams } from 'react-router-dom'
import useQueryParams from '~/app/hooks/useQueryParams'
import { APIError } from '~/app/features/error/type'

export const convertAxiosErrorToAPIError = (error: unknown): APIError => {
  const axiosError = error as AxiosError
  const apiError = axiosError.response?.data as APIError
  return apiError || { status: 500, message: 'Internal Server Error' }
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const createUrlWithParams = (
  oldParams: Partial<ReturnType<typeof useQueryParams>>,
  newParams: Partial<ReturnType<typeof useQueryParams>>
) => {
  const updatedParams = { ...oldParams, ...newParams }
  const searchParams = createSearchParams(
    new URLSearchParams(
      Object.entries(updatedParams)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => [key, String(value)])
    )
  )
  return `?${searchParams.toString()}`
}
