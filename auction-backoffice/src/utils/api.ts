import axios, { type AxiosInstance } from 'axios'
import { convertAxiosErrorToAPIError } from './error'

class API {
  instance: AxiosInstance
  private accessToken: string

  constructor() {
    this.accessToken = localStorage.getItem('accessToken') || ''
    this.instance = axios.create({
      baseURL: 'http://localhost:8080',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

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
