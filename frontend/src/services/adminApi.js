import axios from 'axios'

const adminApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  timeout: 20000,
})

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function adminLogin(name, password) {
  return adminApi.post('admin/login/', { name, password })
}

export function clearAdminAuth() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  window.dispatchEvent(new Event('admin-auth-changed'))
}

export function getAdminUser() {
  const raw = localStorage.getItem('admin_user')
  return raw ? JSON.parse(raw) : null
}

export function setAdminAuth(access, user) {
  localStorage.setItem('admin_token', access)
  localStorage.setItem('admin_user', JSON.stringify(user))
  window.dispatchEvent(new Event('admin-auth-changed'))
}

export default adminApi
