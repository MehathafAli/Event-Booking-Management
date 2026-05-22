import { Navigate, useLocation } from 'react-router-dom'
import { getAdminUser } from '../services/adminApi'

export default function AdminProtectedRoute({ children }) {
  const location = useLocation()
  const adminToken =
    typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
  const adminUser = getAdminUser()
  const userToken =
    typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

  if (!adminToken || !adminUser) {
    return (
      <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
    )
  }

  if (userToken) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return children
}
