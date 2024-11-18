import { convertAxiosErrorToAPIError } from './helper'

import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000
})

api.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
api.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    console.log(error)
    return Promise.reject(convertAxiosErrorToAPIError(error))
  }
)
export default api
