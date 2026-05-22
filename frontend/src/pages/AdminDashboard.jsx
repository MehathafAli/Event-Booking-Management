import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import adminApi, { clearAdminAuth, getAdminUser } from '../services/adminApi'

const SECTIONS = ['Function Halls', 'Food', 'Decorations', 'Services']

const emptyItem = () => ({
  name: '',
  section: 'Food',
  price: 0,
  type: 'fixed',
  details: '',
  image: '',
})

export default function AdminDashboard() {
  const navigate = useNavigate()
  const admin = getAdminUser()
  const adminToken =
    typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
  const [tab, setTab] = useState('bookings')
  const [bookings, setBookings] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingEvent, setEditingEvent] = useState(null)
  const [eventForm, setEventForm] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
    excerpt: '',
    images: [''],
    pricing: [emptyItem()],
  })

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login')
      return
    }
    loadData()
    // Depends on token string, not getAdminUser() object (JSON.parse creates new reference each render)
  }, [navigate, adminToken])

  async function loadData() {
    setLoading(true)
    try {
      const [bRes, eRes] = await Promise.all([
        adminApi.get('admin/bookings/'),
        adminApi.get('admin/events/'),
      ])
      setBookings(bRes.data)
      setEvents(eRes.data)
    } catch {
      clearAdminAuth()
      navigate('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearAdminAuth()
    navigate('/admin/login')
  }

  const approveBooking = async (id, action = 'approve') => {
    await adminApi.patch(`admin/bookings/${id}/approve/`, { action })
    loadData()
  }

  const openNewEvent = () => {
    setEditingEvent(null)
    setEventForm({
      title: '',
      category: 'Wedding',
      location: '',
      description: '',
      excerpt: '',
      images: [''],
      pricing: [emptyItem()],
    })
    setTab('events')
  }

  const openEditEvent = (event) => {
    setEditingEvent(event)
    setEventForm({
      title: event.title || '',
      category: event.category || '',
      location: event.location || '',
      description: event.description || '',
      excerpt: event.excerpt || '',
      images: event.images?.length ? event.images : [''],
      pricing: event.pricing?.length
        ? event.pricing.map((p) => ({ ...p }))
        : [emptyItem()],
    })
    setTab('events')
  }

  const saveEvent = async (e) => {
    e.preventDefault()
    const payload = {
      ...eventForm,
      images: eventForm.images.filter(Boolean),
      pricing: eventForm.pricing.filter((p) => p.name),
    }
    if (editingEvent) {
      await adminApi.put(`admin/events/${editingEvent.id}/`, payload)
    } else {
      await adminApi.post('admin/events/', payload)
    }
    setEditingEvent(null)
    loadData()
    setTab('events')
  }

  const deleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return
    await adminApi.delete(`admin/events/${id}/`)
    loadData()
  }

  if (!admin) return null

  return (
    <section className="mx-auto mt-10 max-w-[1400px] space-y-6 px-5">

  <h2 className="text-2xl font-bold">
    All Bookings
  </h2>

  {bookings.length === 0 ? (

    <p className="text-[#5b6470]">
      No bookings yet.
    </p>

  ) : (

    bookings.map((b) => (

      <article
        key={b.id}
        className="card-3d glass-panel-3d p-6"
      >

        <div className="flex flex-wrap justify-between gap-4">

          {/* LEFT */}

          <div>

            <h3 className="text-xl font-bold">
              {b.event_title}
            </h3>

            <p className="text-sm text-[#5b6470]">

              {b.customer_name}

              {' · '}

              {b.customer_phone}

              {' · '}

              {b.customer_email}

            </p>

            <p className="mt-2 text-sm text-[#5b6470]">

              Date:
              {' '}
              {b.booking_date}

            </p>

            {/* PAYMENT DETAILS */}

            <div className="mt-4 flex flex-wrap gap-3 text-sm">

              {/* TOTAL */}

              <span className="rounded-full bg-[#f8f5f0] px-3 py-1">

                Total:
                {' '}
                ₹{b.total_amount}

              </span>

              {/* PAID */}

              <span className="rounded-full bg-green-100 px-3 py-1 text-green-800">

                Paid:
                {' '}
                ₹{b.amount_paid}

              </span>

              {/* REMAINING */}

              <span className="rounded-full bg-red-100 px-3 py-1 text-red-700">

                Remaining:
                {' '}
                ₹{b.remaining_amount}

              </span>

            </div>

            {/* STATUS */}

            <div className="mt-4 flex flex-wrap gap-3">

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  b.display_status === 'Paid Full'
                    ? 'bg-green-100 text-green-800'
                    : b.display_status === 'Advance Paid'
                    ? 'bg-blue-100 text-blue-800'
                    : b.display_status === 'Rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >

                {b.display_status}

              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  b.status === 'Approved'
                    ? 'bg-green-100 text-green-800'
                    : b.status === 'Rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >

                Admin:
                {' '}
                {b.status}

              </span>

            </div>

          </div>

          {/* RIGHT */}

          <div className="flex flex-col items-end gap-3">

            {/* PAYMENT IMAGE */}

            {b.payment_photo_url && (

              <a
                href={b.payment_photo_url}
                target="_blank"
                rel="noreferrer"
              >

                <img
                  src={b.payment_photo_url}
                  alt="Payment proof"
                  className="h-32 w-48 rounded-xl object-cover shadow"
                />

              </a>
            )}

            {/* APPROVE / REJECT */}

            {b.status === 'Pending' && b.payment_photo_url && (

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() =>
                    approveBooking(
                      b.id,
                      'approve'
                    )
                  }
                  className="rounded-full bg-green-600 px-5 py-2 text-sm text-white"
                >

                  Approve Booking

                </button>

                <button
                  type="button"
                  onClick={() =>
                    approveBooking(
                      b.id,
                      'reject'
                    )
                  }
                  className="rounded-full border border-red-300 px-5 py-2 text-sm text-red-700"
                >

                  Reject

                </button>

              </div>
            )}

          </div>

        </div>

      </article>
    ))
  )}

</section>
  )
}
