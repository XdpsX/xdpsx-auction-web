import axios, { type AxiosInstance } from 'axios'
import { convertAxiosErrorToAPIError } from './error'

class API {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:8080',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.response.use(
      function (response) {
        return response
      },
      function (error) {
        console.log(error)
        return Promise.reject(convertAxiosErrorToAPIError(error))
      }
    )
  }
}
const api = new API().instance
export default api
