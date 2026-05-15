import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()

  const navigate = useNavigate()

  const [mobileMenu, setMobileMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenu(false)
  }

  const navLinks = [
    {
      name: 'Home',
      path: '/',
    },

    {
      name: 'Events',
      path: '/events',
    },

    {
      name: 'Contact',
      path: '/contact',
    },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfd2] bg-[#f8f5f0]/90 backdrop-blur-xl">
      {/* glow */}

      <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(214,191,169,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(232,215,195,0.14),transparent_30%)]" />

      <div className="relative mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        {/* LOGO */}

        <Link
          to="/"
          className="group flex items-center gap-4"
        >
          {user ? (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8b5e34] text-white shadow-lg transition duration-300 group-hover:scale-105">
                <span className="text-lg font-bold">
                  {user.username
                    ?.charAt(0)
                    .toUpperCase() || 'U'}
                </span>
              </div>

              <div>
                <div className="text-xl font-bold text-[#1f2937]">
                  Welcome, {user.username}
                </div>

                <div className="text-xs uppercase tracking-[0.25em] text-[#8b5e34]">
                  EventEase Member
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8b5e34] text-xl font-bold text-white shadow-lg transition duration-300 group-hover:scale-105">
                E
              </div>

              <div>
                <div className="text-2xl font-bold tracking-tight text-[#1f2937]">
                  EventEase
                </div>

                <div className="text-xs uppercase tracking-[0.3em] text-[#8b5e34]">
                  EVENT PLATFORM
                </div>
              </div>
            </>
          )}
        </Link>

        {/* DESKTOP NAV */}

        <nav className="hidden items-center gap-3 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `rounded-full px-6 py-3 text-sm font-semibold transition duration-300 ${
                  isActive
                    ? 'bg-[#8b5e34] text-white shadow-md'
                    : 'text-[#5b6470] hover:bg-white hover:text-[#1f2937]'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {user ? (
            <>
              <div className="rounded-full border border-[#eadfd2] bg-white px-5 py-3 text-sm font-medium text-[#5b6470] shadow-sm">
                Hi, {user.username}
              </div>

              <button
                onClick={handleLogout}
                className="rounded-full bg-[#8b5e34] px-6 py-3 text-sm font-semibold text-white shadow-md transition duration-300 hover:bg-[#714a28]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-[#eadfd2] bg-white px-6 py-3 text-sm font-semibold text-[#5b6470] shadow-sm transition duration-300 hover:bg-[#f4e8dc] hover:text-[#1f2937]"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-[#8b5e34] px-7 py-3 text-sm font-semibold text-white shadow-md transition duration-300 hover:bg-[#714a28]"
              >
                Register
              </Link>
            </>
          )}
        </nav>

        {/* MOBILE BUTTON */}

        <button
          onClick={() =>
            setMobileMenu(!mobileMenu)
          }
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#eadfd2] bg-white text-[#1f2937] shadow-sm lg:hidden"
        >
          <div className="space-y-1">
            <div className="h-[2px] w-5 rounded-full bg-[#1f2937]" />

            <div className="h-[2px] w-5 rounded-full bg-[#1f2937]" />

            <div className="h-[2px] w-5 rounded-full bg-[#1f2937]" />
          </div>
        </button>
      </div>

      {/* MOBILE MENU */}

      {mobileMenu && (
        <div className="border-t border-[#eadfd2] bg-[#f8f5f0] px-5 py-5 lg:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() =>
                  setMobileMenu(false)
                }
                className={({ isActive }) =>
                  `rounded-2xl px-5 py-4 text-base font-semibold transition duration-300 ${
                    isActive
                      ? 'bg-[#8b5e34] text-white'
                      : 'bg-white text-[#5b6470] hover:bg-[#f4e8dc]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {user ? (
              <>
                <div className="rounded-2xl border border-[#eadfd2] bg-white px-5 py-4 text-center font-medium text-[#5b6470] shadow-sm">
                  Welcome, {user.username}
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-2xl bg-[#8b5e34] px-5 py-4 font-semibold text-white shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() =>
                    setMobileMenu(false)
                  }
                  className="rounded-2xl border border-[#eadfd2] bg-white px-5 py-4 text-center font-semibold text-[#5b6470] shadow-sm"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() =>
                    setMobileMenu(false)
                  }
                  className="rounded-2xl bg-[#8b5e34] px-5 py-4 text-center font-semibold text-white shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}




/*import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-slate-900">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20">
                <span className="text-lg font-bold">{user.username?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
              <div>
                <div className="text-xl font-semibold">Welcome, {user.username}</div>
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">EventEase member</div>
              </div>
            </div>
          ) : (
            <div className="text-xl font-semibold">EventEase</div>
          )}
        </Link>

        <nav className="flex items-center gap-4 text-sm text-slate-700">
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          <Link to="/contact">Contact</Link>
          {user ? (
            <>
              <span className="text-slate-600">Welcome, {user.username}!</span>
              <button
                onClick={handleLogout}
                className="rounded-full bg-sky-500 px-4 py-2 text-white hover:bg-sky-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="rounded-full bg-sky-500 px-4 py-2 text-white hover:bg-sky-600">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
*/