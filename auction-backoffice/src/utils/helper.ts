import { AxiosError } from 'axios'
import { jwtDecode } from 'jwt-decode'
import { APIError } from '~/app/features/error/type'
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, MIN_WIDTH } from '~/constants'

export const convertAxiosErrorToAPIError = (error: unknown): APIError => {
  const axiosError = error as AxiosError
  const apiError = axiosError.response?.data as APIError
  return apiError || { status: 500, message: 'Internal Server Error' }
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export interface ImageValidationResult {
  isValid: boolean
  errorMessage: string | null
}

/**
 * Validate an image file's size, type, and width.
 * @param file - The image file to validate.
 * @returns {Promise<ImageValidationResult>} - Validation result with success status and error message if any.
 */
export const validateImage = (file: File): Promise<ImageValidationResult> => {
  return new Promise((resolve) => {
    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return resolve({ isValid: false, errorMessage: 'Only JPEG and PNG images are allowed' })
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      return resolve({ isValid: false, errorMessage: 'Image size must not exceed 5MB' })
    }

    // Validate image width
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      if (img.width < MIN_WIDTH) {
        resolve({ isValid: false, errorMessage: 'Image width must be at least 800px' })
      } else {
        resolve({ isValid: true, errorMessage: null })
      }
    }
  })
}

export function getDateTime(n: number = 0) {
  // Lấy ngày hôm nay
  const today = new Date()

  // Tạo ngày của n ngày sau
  const targetDate = new Date(today)
  targetDate.setDate(today.getDate() + n) // Thêm n ngày

  // Lấy các thành phần của ngày
  const year = targetDate.getFullYear()
  const month = String(targetDate.getMonth() + 1).padStart(2, '0') // Tháng bắt đầu từ 0
  const day = String(targetDate.getDate()).padStart(2, '0')
  const hours = String(targetDate.getHours()).padStart(2, '0')
  const minutes = String(targetDate.getMinutes()).padStart(2, '0')
  const seconds = String(targetDate.getSeconds()).padStart(2, '0')

  // Trả về định dạng YYYY-MM-DDTHH:mm:ss
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

interface DecodedToken {
  scope: string
}
export const getRolesFromToken = (accessToken: string): string[] => {
  const decodedToken = jwtDecode<DecodedToken>(accessToken)
  const scope = decodedToken.scope
  return scope.split(' ')
}
