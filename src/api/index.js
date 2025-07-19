import axios from 'axios';
import router from '../router';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Запрос:', config.method, config.url);
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Ответ:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Ошибка:', error.response.status, error.response.data);
      if (error.response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/login');
      } else if (error.response.status === 403) {
        router.push('/');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
