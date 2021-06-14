import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.VITE_API_BASE_URL
})

axiosInstance.interceptors.response.use(function (response) {
  return response.data
}, function (error) {
  throw error.response.data
})

export default axiosInstance
