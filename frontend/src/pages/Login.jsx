import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await API.post('login/', {
        email,
        password,
      })

      if (response.data.access) {
        login(
          {
            email,
            username:
              response.data.user?.username ||
              email.split('@')[0],
          },
          response.data.access
        )

        const redirectTo = location.state?.from || '/dashboard'
        navigate(redirectTo)
      }
    } catch (err) {
      const errorData = err.response?.data

      const serverMessage =
        errorData?.detail ||
        (Array.isArray(
          errorData?.non_field_errors
        ) &&
          errorData.non_field_errors[0]) ||
        'Login failed. Please check your credentials.'

      if (
        typeof serverMessage === 'string' &&
        serverMessage.includes(
          'Account not found'
        )
      ) {
        setError(
          'Account not found. Please register first.'
        )
      } else {
        setError(serverMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const successMessage = location.state?.message

  return (
    <div className="min-h-screen bg-[#f8f5f0] py-16">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid overflow-hidden rounded-[3rem] bg-white shadow-xl lg:grid-cols-2">
          {/* LEFT SIDE */}

          <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#f4e8dc] via-[#f8f5f0] to-[#efe3d5] p-12 lg:flex lg:flex-col lg:justify-between">
            {/* glow */}

            <div className="absolute left-[-100px] top-[-100px] h-[260px] w-[260px] rounded-full bg-[#d6bfa9]/30 blur-[100px]" />

            <div className="absolute bottom-[-120px] right-[-120px] h-[280px] w-[280px] rounded-full bg-[#e6d4c0]/40 blur-[120px]" />

            {/* top */}

            <div className="relative z-10">
              <div className="inline-flex rounded-full border border-[#d6c3af] bg-white/70 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#8b5e34] shadow-sm">
                EventEase
              </div>

              <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight text-[#1f2937]">
                Welcome
                <span className="block text-[#8b5e34]">
                  Back
                </span>
              </h1>

              <p className="mt-8 max-w-lg text-lg leading-9 text-[#5b6470]">
                Login to manage your event bookings,
                packages, catering, decorations,
                photography, and premium event services.
              </p>
            </div>

            {/* image */}

            <div className="relative z-10 mt-10 overflow-hidden rounded-[2.5rem] shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=80"
                alt="event"
                className="h-[320px] w-full object-cover"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="p-8 sm:p-10 lg:p-14">
            <div className="max-w-xl">
              <div className="inline-flex rounded-full bg-[#f4e8dc] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#8b5e34]">
                LOGIN ACCOUNT
              </div>

              <h2 className="mt-7 text-4xl font-bold tracking-tight text-[#1f2937]">
                Sign In
              </h2>

              <p className="mt-4 text-base leading-8 text-[#5b6470]">
                Access your EventEase account and
                continue managing your bookings and
                premium event packages.
              </p>

              {/* success */}

              {successMessage && (
                <div className="mt-8 rounded-[1.5rem] border border-green-200 bg-green-50 px-5 py-4">
                  <p className="text-sm font-medium text-green-700">
                    {successMessage}
                  </p>
                </div>
              )}

              {/* error */}

              {error && (
                <div className="mt-8 rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4">
                  <p className="text-sm font-medium text-red-700">
                    {error}
                  </p>
                </div>
              )}

              {/* form */}

              <form
                onSubmit={handleLogin}
                className="mt-10 space-y-7"
              >
                {/* email */}

                <div>
                  <label className="text-sm font-semibold uppercase tracking-wide text-[#1f2937]">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    required
                    className="input-3d mt-3"
                  />
                </div>

                {/* password */}

                <div>
                  <label className="text-sm font-semibold uppercase tracking-wide text-[#1f2937]">
                    Password
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    required
                    className="input-3d mt-3"
                  />
                </div>

                {/* button */}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-3d w-full rounded-full bg-[#8b5e34] px-8 py-4 text-base text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? 'Logging In...'
                    : 'Login'}
                </button>
              </form>

              {/* register */}

              <p className="mt-8 text-center text-base text-[#5b6470]">
                Don&apos;t have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-[#8b5e34] transition hover:text-[#714a28]"
                >
                  Register here
                </Link>
              </p>

              {/* features */}

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.5rem] bg-[#f8f5f0] p-5 text-center">
                  <p className="text-2xl font-bold text-[#8b5e34]">
                    1200+
                  </p>

                  <p className="mt-2 text-sm text-[#5b6470]">
                    Events
                  </p>
                </div>

                <div className="rounded-[1.5rem] bg-[#f8f5f0] p-5 text-center">
                  <p className="text-2xl font-bold text-[#8b5e34]">
                    950+
                  </p>

                  <p className="mt-2 text-sm text-[#5b6470]">
                    Clients
                  </p>
                </div>

                <div className="rounded-[1.5rem] bg-[#f8f5f0] p-5 text-center">
                  <p className="text-2xl font-bold text-[#8b5e34]">
                    150+
                  </p>

                  <p className="mt-2 text-sm text-[#5b6470]">
                    Vendors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}






/*import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await API.post('login/', {
        email,
        password,
      })

      if (response.data.access) {
        login(
          {
            email,
            username: response.data.user?.username || email.split('@')[0],
          },
          response.data.access
        )
        navigate('/events')
      }
    } catch (err) {
      const errorData = err.response?.data
      const serverMessage =
        errorData?.detail ||
        (Array.isArray(errorData?.non_field_errors) && errorData.non_field_errors[0]) ||
        'Login failed. Please check your credentials.'

      if (typeof serverMessage === 'string' && serverMessage.includes('Account not found')) {
        setError('Account not found. Please register here.')
      } else {
        setError(serverMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const successMessage = location.state?.message

  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 shadow-lg">
      <h1 className="text-3xl font-semibold">Login</h1>
      <p className="mt-2 text-slate-500">Access your EventEase account and manage your bookings.</p>
      {successMessage && (
        <div className="mt-6 rounded-3xl bg-green-50 px-4 py-3 text-green-700">{successMessage}</div>
      )}
      {error && (
        <div className="mt-6 rounded-3xl bg-red-50 px-4 py-3 text-red-700">{error}</div>
      )}
      <form onSubmit={handleLogin} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-3xl bg-sky-600 px-5 py-3 text-white hover:bg-sky-700 disabled:bg-gray-400"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-6 text-center text-slate-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-sky-600 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  )
}*/
