export type APIError = {
  status: number
  message: string
}

export type APIErrorDetails = APIError & {
  fieldErrors: Map<string, string>
}
