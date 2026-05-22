import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin, setAdminAuth } from '../services/adminApi'

export default function AdminLogin() {
  const [name, setName] = useState('Ali')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await adminLogin(name, password)
      setAdminAuth(res.data.access, res.data.user)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      const msg =
        err.code === 'ECONNABORTED'
          ? 'Server did not respond. Is Django running on port 8000?'
          : err.response?.data?.detail ||
            'Invalid admin name or password, or server error.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative z-20 flex min-h-[70vh] items-center justify-center py-12">
      <form
        onSubmit={handleSubmit}
        className="relative z-20 w-full max-w-md rounded-2xl border border-[#d9c9b8] bg-white p-10 shadow-2xl"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8b5e34]">
          Admin Portal
        </p>
        <h1 className="mt-4 text-3xl font-bold text-[#1f2937]">Admin Login</h1>
        <p className="mt-2 text-sm text-[#5b6470]">
          Manage bookings, events, food, halls, decoration & services.
        </p>

        {error && (
          <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <label className="mt-8 block text-xs font-semibold uppercase text-[#1f2937]">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="username"
          className="mt-2 w-full rounded-xl border-2 border-[#d9c9b8] bg-[#faf7f2] px-4 py-3 text-[#1f2937] outline-none focus:border-[#8b5e34] focus:bg-white"
        />

        <label className="mt-5 block text-xs font-semibold uppercase text-[#1f2937]">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="mt-2 w-full rounded-xl border-2 border-[#d9c9b8] bg-[#faf7f2] px-4 py-3 text-[#1f2937] outline-none focus:border-[#8b5e34] focus:bg-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-full bg-[#8b5e34] py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-[#714a28] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Login as Admin'}
        </button>
      </form>
    </section>
  )
}
