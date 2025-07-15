// src/axios.js
import axios from 'axios'
import router from '../src/router/index'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
})

// Добавляем токен в каждый запрос
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Перехватываем 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Очистка токенов и редирект
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default api
