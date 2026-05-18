import axios from 'axios'

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export function clearAuthStorage() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
  window.dispatchEvent(new Event('auth-logout'))
}

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token && !config._skipAuth) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error.response?.status
    const hadToken = Boolean(localStorage.getItem('access_token'))

    if (
      status === 401 &&
      hadToken &&
      original &&
      !original._retryWithoutAuth
    ) {
      clearAuthStorage()
      original._retryWithoutAuth = true
      original._skipAuth = true
      delete original.headers.Authorization
      return API.request(original)
    }

    return Promise.reject(error)
  }
)

export default API
