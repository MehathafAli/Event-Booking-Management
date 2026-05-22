import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAdminUser } from '../services/adminApi'

/** Guest-only routes: redirect if already logged in as admin or user. */
export default function GuestRoute({ children, userOnly = false, adminOnly = false }) {
  const { user, loading } = useAuth()
  const adminUser = getAdminUser()
  const adminToken =
    typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null

  if (loading && userOnly) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-[#5b6470]">Loading...</p>
      </div>
    )
  }

  if (adminToken && adminUser) {
    return <Navigate to="/admin/dashboard" replace />
  }

  if (user && (userOnly || adminOnly)) {
    return <Navigate to="/events" replace />
  }

  return children
}
