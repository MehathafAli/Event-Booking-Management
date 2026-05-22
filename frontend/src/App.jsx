import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import Contact from './pages/Contact'
import Navbar from './components/Navbar'
import BookingSuccess from './pages/BookingSuccess'
import Dashboard from './pages/Dashboard'
import Payment from './pages/Payment'
import ProtectedRoute from './components/ProtectedRoute'
import PageBackdrop from './components/PageBackdrop'
import SiteFooter from './components/SiteFooter'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <AuthProvider>
      <div className="page-3d-wrap min-h-screen text-[#1f2937]">
        <PageBackdrop />
        <Navbar />
        <main className="page-3d-content px-4 py-6 md:px-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking-success/:id" element={<BookingSuccess />} />
            <Route path="/payment/:id" element={<Payment />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <SiteFooter />
      </div>
    </AuthProvider>
  )
}

export default App
