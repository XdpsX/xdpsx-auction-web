export type APIError = {
  status: number
  message: string
  fieldErrors?: Map<string, string>
}
