import axios from 'axios';
import { getCookie } from 'cookies-next';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FAVORITE_PRODUCTS_API_URL,
})

api.interceptors.request.use(
  async (config) => {
    const token = getCookie('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Remove o token se quiser: ex: deleteCookie('token')
      window.location.href = '/entrar'
    }

    return Promise.reject(error)
  },
)

export default api