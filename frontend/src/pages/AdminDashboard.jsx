import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import adminApi, { clearAdminAuth, getAdminUser } from '../services/adminApi'

const SECTIONS = ['Function Halls', 'Food', 'Decorations', 'Services']

const emptyItem = (section = 'Food') => ({
  name: '',
  section,
  price: 0,
  type: section === 'Food' ? 'perPerson' : 'fixed',
  details: '',
  image: '',
  diet: section === 'Food' ? 'veg' : undefined,
})

const formatMoney = (n) =>
  `₹${Number(n || 0).toLocaleString('en-IN')}`
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const inputClass =
  'mt-1 w-full rounded-xl border border-[#d9c9b8] bg-[#faf7f2] px-3 py-2 text-sm text-[#1f2937] outline-none focus:border-[#8b5e34] focus:bg-white'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const admin = getAdminUser()
  const adminToken =
    typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null

  const [tab, setTab] = useState('bookings')
  const [bookingFilter, setBookingFilter] = useState('all')
  const [bookings, setBookings] = useState([])
  const [events, setEvents] = useState([])
  const [report, setReport] = useState(null)
  const [reportYear, setReportYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [showEventForm, setShowEventForm] = useState(false)
  const [notesDraft, setNotesDraft] = useState({})
  const [rejectModal, setRejectModal] = useState({
    open: false,
    bookingId: null,
    eventTitle: '',
    reason: '',
    error: '',
  })
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'Wedding',
    location: '',
    description: '',
    excerpt: '',
    images: [''],
    pricing: [],
  })

  useEffect(() => {
    if (!adminToken) {
      navigate('/login')
      return
    }
    loadData()
  }, [navigate, adminToken, bookingFilter, reportYear])

  async function loadData() {
    setLoading(true)
    try {
      const bookingUrl =
        bookingFilter === 'pending'
          ? 'admin/bookings/pending/'
          : 'admin/bookings/'
      const [bRes, eRes, rRes] = await Promise.all([
        adminApi.get(bookingUrl),
        adminApi.get('admin/events/'),
        adminApi.get(`admin/reports/profit/?year=${reportYear}`),
      ])
      setBookings(bRes.data)
      setEvents(eRes.data)
      setReport(rRes.data)
    } catch {
      clearAdminAuth()
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearAdminAuth()
    navigate('/login')
  }

  const approveBooking = async (id, action = 'approve') => {
    await adminApi.patch(`admin/bookings/${id}/approve/`, { action })
    loadData()
  }

  const openRejectModal = (booking) => {
    setRejectModal({
      open: true,
      bookingId: booking.id,
      eventTitle: booking.event_title,
      reason: '',
      error: '',
    })
  }

  const closeRejectModal = () => {
    setRejectModal({
      open: false,
      bookingId: null,
      eventTitle: '',
      reason: '',
      error: '',
    })
  }

  const submitReject = async (e) => {
    e.preventDefault()
    const reason = rejectModal.reason.trim()
    if (reason.length < 10) {
      setRejectModal((prev) => ({
        ...prev,
        error: 'Please enter a reason (at least 10 characters).',
      }))
      return
    }
    setSaving(true)
    try {
      await adminApi.patch(
        `admin/bookings/${rejectModal.bookingId}/approve/`,
        { action: 'reject', reason }
      )
      closeRejectModal()
      loadData()
    } catch (err) {
      setRejectModal((prev) => ({
        ...prev,
        error:
          err.response?.data?.detail ||
          'Could not reject booking. Please try again.',
      }))
    } finally {
      setSaving(false)
    }
  }

  const saveAdminNotes = async (bookingId) => {
    const notes = notesDraft[bookingId]
    if (notes === undefined) return
    setSaving(true)
    try {
      await adminApi.patch(`admin/bookings/${bookingId}/`, {
        admin_notes: notes,
      })
      loadData()
    } finally {
      setSaving(false)
    }
  }

  const openNewEvent = () => {
    setEditingEvent(null)
    setShowEventForm(true)
    setEventForm({
      title: '',
      category: 'Wedding',
      location: '',
      description: '',
      excerpt: '',
      images: [''],
      pricing: SECTIONS.map((s) => emptyItem(s)),
    })
    setTab('events')
  }

  const openEditEvent = (event) => {
    setEditingEvent(event)
    setShowEventForm(true)
    setEventForm({
      title: event.title || '',
      category: event.category || 'Wedding',
      location: event.location || '',
      description: event.description || '',
      excerpt: event.excerpt || '',
      images: event.images?.length ? [...event.images] : [''],
      pricing: event.pricing?.length
        ? event.pricing.map((p) => ({ ...p }))
        : SECTIONS.map((s) => emptyItem(s)),
    })
    setTab('events')
  }

  const cancelEventForm = () => {
    setShowEventForm(false)
    setEditingEvent(null)
  }

  const addPricingItem = (section) => {
    setEventForm((prev) => ({
      ...prev,
      pricing: [...prev.pricing, emptyItem(section)],
    }))
  }

  const removePricingItem = (index) => {
    setEventForm((prev) => ({
      ...prev,
      pricing: prev.pricing.filter((_, i) => i !== index),
    }))
  }

  const updatePricingItem = (index, field, value) => {
    setEventForm((prev) => ({
      ...prev,
      pricing: prev.pricing.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  const saveEvent = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...eventForm,
        images: eventForm.images.filter(Boolean),
        pricing: eventForm.pricing
          .filter((p) => p.name?.trim())
          .map((p) => {
            const item = { ...p, price: Number(p.price) || 0 }
            if (!item.diet) delete item.diet
            return item
          }),
      }
      if (editingEvent) {
        await adminApi.put(`admin/events/${editingEvent.id}/`, payload)
      } else {
        await adminApi.post('admin/events/', payload)
      }
      setShowEventForm(false)
      setEditingEvent(null)
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  const deleteEvent = async (id) => {
    if (!window.confirm('Delete this event and all related data?')) return
    await adminApi.delete(`admin/events/${id}/`)
    loadData()
  }

  if (!admin) return null

  const pricingBySection = (section) =>
    eventForm.pricing
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.section === section)

  return (
    <section className="mx-auto mt-8 max-w-[1400px] space-y-6 px-5 pb-16">
      {report && (
      <div></div>
)}

  {/* Tabs */}

<nav className="flex flex-wrap gap-3">
  {[
    {
      id: 'dashboard',
      label: 'Dashboard',
    },

    {
      id: 'bookings',
      label: 'All Bookings',
    },

    {
      id: 'events',
      label: 'Events & Packages',
    },

    {
      id: 'profit',
      label: 'Profit Report',
    },
  ].map(({ id, label }) => (
    <button
      key={id}
      type="button"
      onClick={() => setTab(id)}
      className={`rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
        tab === id
          ? 'bg-[#8b5e34] text-white shadow-lg scale-[1.02]'
          : 'border border-[#d9c9b8] bg-white text-[#1f2937] hover:bg-[#faf7f2]'
      }`}
    >
      {label}
    </button>
  ))}
</nav>

{/* MAIN CONTENT */}

{loading ? (
  <div className="flex min-h-[300px] items-center justify-center">
    <div className="space-y-3 text-center">
      <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[#8b5e34] border-t-transparent" />

      <p className="font-medium text-[#5b6470]">
        Loading dashboard...
      </p>
    </div>
  </div>
) : tab === 'dashboard' ? (

<div className="space-y-8">

  {/* HERO */}

  <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#8b5e34] via-[#9d6b3f] to-[#714a28] p-8 text-white shadow-2xl">

    <div className="flex flex-wrap items-center justify-between gap-6">

      <div>

        <p className="text-sm uppercase tracking-[0.35em] text-white/80">
          EventEase Admin
        </p>

        <h1 className="mt-3 text-4xl font-black leading-tight">
          Welcome Back,
          <br />
          {admin?.username || 'Admin'}
        </h1>

        <p className="mt-4 max-w-2xl text-sm text-white/80">
          Monitor bookings, profits, events, approvals and customer activity in real time.
        </p>

      </div>

      <div className="grid gap-4 sm:grid-cols-2">

        <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">

          <p className="text-xs uppercase tracking-widest text-white/70">
            Today Bookings
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {bookings.length}
          </h2>

        </div>

        <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">

          <p className="text-xs uppercase tracking-widest text-white/70">
            Total Revenue
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {formatMoney(report?.overall_profit || 0)}
          </h2>

        </div>

      </div>

    </div>

  </section>

  {/* STATS */}

  <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

    <article className="group rounded-[2rem] border border-[#e8dfd4] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-widest text-[#8b5e34]">
            Total Bookings
          </p>

          <h2 className="mt-3 text-4xl font-black text-[#1f2937]">
            {bookings.length}
          </h2>

        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f8f1e8] text-3xl">
          📅
        </div>

      </div>

    </article>

    <article className="group rounded-[2rem] border border-[#e8dfd4] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-widest text-green-700">
            Revenue
          </p>

          <h2 className="mt-3 text-4xl font-black text-[#1f2937]">
            {formatMoney(report?.overall_profit || 0)}
          </h2>

        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl">
          💰
        </div>

      </div>

    </article>

    <article className="group rounded-[2rem] border border-[#e8dfd4] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-widest text-blue-700">
            Events
          </p>

          <h2 className="mt-3 text-4xl font-black text-[#1f2937]">
            {events.length}
          </h2>

        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
          🎉
        </div>

      </div>

    </article>

    <article className="group rounded-[2rem] border border-[#e8dfd4] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-widest text-orange-700">
            Pending
          </p>

          <h2 className="mt-3 text-4xl font-black text-[#1f2937]">

            {
              bookings.filter(
                (b) => b.status === 'Pending'
              ).length
            }

          </h2>

        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-3xl">
          ⏳
        </div>

      </div>

    </article>

  </section>

  {/* MAIN GRID */}

  <section className="grid gap-6 xl:grid-cols-3">

    {/* RECENT BOOKINGS */}

    <div className="xl:col-span-2 rounded-[2rem] border border-[#e8dfd4] bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.3em] text-[#8b5e34]">
            Recent Activity
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#1f2937]">
            Latest Bookings
          </h2>

        </div>

        <button
          onClick={() => setTab('bookings')}
          className="rounded-full bg-[#8b5e34] px-5 py-2 text-sm font-semibold text-white hover:bg-[#714a28]"
        >
          View All
        </button>

      </div>

      <div className="mt-6 space-y-4">

        {bookings.slice(0, 6).map((booking) => (

          <div
            key={booking.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#ece3d8] bg-[#faf7f2] p-4"
          >

            <div>

              <h3 className="font-bold text-[#1f2937]">
                {booking.customer_name}
              </h3>

              <p className="text-sm text-[#5b6470]">
                {booking.event_title}
              </p>

              <p className="mt-1 text-xs text-[#8b5e34]">
                {booking.booking_date}
              </p>

            </div>

            <div className="text-right">

              <p className="text-lg font-black text-green-700">
                {formatMoney(booking.total_amount)}
              </p>

              <StatusBadge
                label={booking.status}
                variant="admin"
                status={booking.status}
              />

            </div>

          </div>

        ))}

      </div>

    </div>

    {/* RIGHT SIDEBAR */}

    <div className="space-y-6">

      {/* QUICK ACTIONS */}

      <div className="rounded-[2rem] border border-[#e8dfd4] bg-white p-6 shadow-sm">

        <p className="text-xs uppercase tracking-[0.3em] text-[#8b5e34]">
          Quick Actions
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#1f2937]">
          Manage
        </h2>

        <div className="mt-6 space-y-3">

          <button
            onClick={() => setTab('bookings')}
            className="w-full rounded-2xl bg-[#8b5e34] px-5 py-4 text-left font-semibold text-white transition hover:bg-[#714a28]"
          >
            Manage Bookings
          </button>

          <button
            onClick={() => setTab('events')}
            className="w-full rounded-2xl bg-[#1f2937] px-5 py-4 text-left font-semibold text-white transition hover:bg-black"
          >
            Manage Events
          </button>

          <button
            onClick={() => setTab('profit')}
            className="w-full rounded-2xl bg-green-600 px-5 py-4 text-left font-semibold text-white transition hover:bg-green-700"
          >
            Profit Analytics
          </button>

        </div>

      </div>

      {/* MONTHLY */}

      <div className="rounded-[2rem] border border-[#e8dfd4] bg-white p-6 shadow-sm">

        <p className="text-xs uppercase tracking-[0.3em] text-[#8b5e34]">
          Revenue
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#1f2937]">
          Monthly Profit
        </h2>

        <div className="mt-6 space-y-4">

          {report?.monthly_profit?.slice(-5).map((m) => (

            <div key={m.month}>

              <div className="mb-2 flex items-center justify-between text-sm">

                <span className="font-medium text-[#5b6470]">
                  {MONTH_LABELS[m.month - 1]}
                </span>

                <span className="font-bold text-[#1f2937]">
                  {formatMoney(m.profit)}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#ece3d8]">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8b5e34] to-[#d2a679]"
                  style={{
                    width: `${Math.min((m.profit / (report?.overall_profit || 1)) * 100, 100)}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  </section>

</div>

) : tab === 'profit' ? (

<section className="space-y-8">

  {/* HERO */}

  <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#8b5e34] via-[#a06a3d] to-[#714a28] p-8 text-white shadow-2xl">

    <div className="flex flex-wrap items-center justify-between gap-6">

      <div>

        <p className="text-sm uppercase tracking-[0.35em] text-white/70">
          EventEase Analytics
        </p>

        <h1 className="mt-3 text-5xl font-black leading-tight">
          Profit Report
        </h1>

        <p className="mt-4 max-w-2xl text-sm text-white/80">
          Real-time business insights, revenue analytics and booking performance overview.
        </p>

      </div>

      <div className="rounded-[2rem] bg-white/10 p-6 backdrop-blur">

        <p className="text-xs uppercase tracking-widest text-white/70">
          Selected Year
        </p>

        <select
          value={reportYear}
          onChange={(e) =>
            setReportYear(
              Number(e.target.value)
            )
          }
          className="mt-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-lg font-bold text-white outline-none backdrop-blur"
        >

          {Array.from({ length: 6 }).map((_, i) => {

            const y =
              new Date().getFullYear() - i

            return (
              <option
                key={y}
                value={y}
                className="text-black"
              >
                {y}
              </option>
            )
          })}

        </select>

      </div>

    </div>

  </div>

  {/* TOP STATS */}

  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

    <article className="rounded-[2rem] border border-[#ece3d8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-widest text-[#8b5e34]">
            Overall Profit
          </p>

          <h2 className="mt-3 text-4xl font-black text-[#1f2937]">
            {formatMoney(
              report.overall_profit || 0
            )}
          </h2>

        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f8f1e8] text-3xl">
          💰
        </div>

      </div>

    </article>

    <article className="rounded-[2rem] border border-[#ece3d8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-widest text-green-700">
            Total Bookings
          </p>

          <h2 className="mt-3 text-4xl font-black text-[#1f2937]">
            {report.totals?.bookings || 0}
          </h2>

        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl">
          📅
        </div>

      </div>

    </article>

    <article className="rounded-[2rem] border border-[#ece3d8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-widest text-blue-700">
            Events
          </p>

          <h2 className="mt-3 text-4xl font-black text-[#1f2937]">
            {report.totals?.events || 0}
          </h2>

        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
          🎉
        </div>

      </div>

    </article>

    <article className="rounded-[2rem] border border-[#ece3d8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-widest text-pink-700">
            Packages
          </p>

          <h2 className="mt-3 text-4xl font-black text-[#1f2937]">
            {report.totals?.packages || 0}
          </h2>

        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 text-3xl">
          📦
        </div>

      </div>

    </article>

  </div>

  {/* ANALYTICS */}

  <div className="grid gap-6 xl:grid-cols-3">

    {/* MONTHLY */}

    <div className="xl:col-span-2 rounded-[2rem] border border-[#ece3d8] bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.3em] text-[#8b5e34]">
            Revenue Analytics
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#1f2937]">
            Monthly Profit
          </h2>

        </div>

        <span className="rounded-full bg-[#f8f1e8] px-4 py-2 text-xs font-bold text-[#8b5e34]">
          Dynamic
        </span>

      </div>

      <div className="mt-8 space-y-5">

        {report.monthly_profit?.map((m) => {

          const maxProfit = Math.max(
            ...report.monthly_profit.map(
              (x) => x.profit || 0
            ),
            1
          )

          const width =
            (m.profit / maxProfit) * 100

          return (

            <div key={m.month}>

              <div className="mb-2 flex items-center justify-between">

                <div>

                  <p className="font-semibold text-[#1f2937]">
                    {MONTH_LABELS[m.month - 1]}
                  </p>

                  <p className="text-xs text-[#5b6470]">
                    Monthly revenue
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-lg font-black text-[#1f2937]">
                    {formatMoney(m.profit)}
                  </p>

                  <p className="text-xs font-medium text-green-700">
                    {width.toFixed(0)}%
                  </p>

                </div>

              </div>

              <div className="h-4 overflow-hidden rounded-full bg-[#ece3d8]">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8b5e34] via-[#c28a58] to-[#e7bb89] transition-all duration-1000"
                  style={{
                    width: `${width}%`,
                  }}
                />

              </div>

            </div>
          )
        })}

      </div>

    </div>

    {/* SIDE INSIGHTS */}

    <div className="space-y-6">

      {/* YEARLY */}

      <div className="rounded-[2rem] border border-[#ece3d8] bg-white p-6 shadow-sm">

        <p className="text-xs uppercase tracking-[0.3em] text-[#8b5e34]">
          Growth
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#1f2937]">
          Yearly Profit
        </h2>

        <div className="mt-6 space-y-5">

          {report.yearly_profit?.map((y) => {

            const maxProfit = Math.max(
              ...report.yearly_profit.map(
                (x) => x.profit || 0
              ),
              1
            )

            const width =
              (y.profit / maxProfit) * 100

            return (

              <div key={y.year}>

                <div className="mb-2 flex items-center justify-between">

                  <span className="font-semibold text-[#1f2937]">
                    {y.year}
                  </span>

                  <span className="font-black text-green-700">
                    {formatMoney(y.profit)}
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-[#ece3d8]">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-300 transition-all duration-1000"
                    style={{
                      width: `${width}%`,
                    }}
                  />

                </div>

              </div>
            )
          })}

        </div>

      </div>

      {/* INSIGHTS */}

      <div className="rounded-[2rem] bg-gradient-to-br from-[#1f2937] to-black p-6 text-white shadow-xl">

        <p className="text-xs uppercase tracking-[0.3em] text-white/60">
          Insights
        </p>

        <h2 className="mt-2 text-2xl font-black">
          Business Overview
        </h2>

        <div className="mt-6 space-y-4">

          <div className="rounded-2xl bg-white/10 p-4">

            <p className="text-xs uppercase tracking-widest text-white/60">
              Average Revenue
            </p>

            <h3 className="mt-2 text-2xl font-black">

              {formatMoney(
                (report.overall_profit || 0) /
                Math.max(
                  report.totals?.bookings || 1,
                  1
                )
              )}

            </h3>

          </div>

          <div className="rounded-2xl bg-white/10 p-4">

            <p className="text-xs uppercase tracking-widest text-white/60">
              Performance
            </p>

            <h3 className="mt-2 text-2xl font-black text-green-300">
              Excellent
            </h3>

          </div>

        </div>

      </div>

    </div>

  </div>

</section>

) : tab === 'bookings' ? (
        /* ─── BOOKINGS TAB ─── */
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-[#1f2937]">
              Booking Details
            </h2>
            <div className="flex gap-2">
              {['all', 'pending'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setBookingFilter(f)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                    bookingFilter === f
                      ? 'bg-[#8b5e34] text-white'
                      : 'border border-[#d9c9b8] bg-white text-[#5b6470]'
                  }`}
                >
                  {f === 'all' ? 'All' : 'Pending only'}
                </button>
              ))}
            </div>
          </div>

          {bookings.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[#d9c9b8] bg-white p-10 text-center text-[#5b6470]">
              No bookings found.
            </p>
          ) : (
            bookings.map((b) => (
              <article
                key={b.id}
                className="card-3d glass-panel-3d space-y-5 p-6"
              >
                <div className="flex flex-wrap justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold text-[#1f2937]">
                        #{b.id} — {b.event_title}
                      </h3>
                      <span className="rounded-full bg-[#f8f5f0] px-2 py-0.5 text-xs text-[#8b5e34]">
                        {b.event_category}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <StatusBadge label={b.display_status} variant="payment" />
                      <StatusBadge label={`Admin: ${b.status}`} variant="admin" status={b.status} />
                      <StatusBadge label={b.payment_status} variant="muted" />
                    </div>
                  </div>
                  {b.payment_photo_url && (
                    <a
                      href={b.payment_photo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0"
                    >
                      <img
                        src={b.payment_photo_url}
                        alt="Payment proof"
                        className="h-28 w-40 rounded-xl border object-cover shadow"
                      />
                      <p className="mt-1 text-center text-xs text-[#8b5e34]">
                        View payment proof
                      </p>
                    </a>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailBlock title="Customer">
                    <p>{b.customer_name || '—'}</p>
                    <p className="text-[#5b6470]">{b.customer_phone}</p>
                    <p className="text-[#5b6470]">{b.customer_email}</p>
                    {b.customer_address && (
                      <p className="mt-1 text-sm text-[#5b6470]">
                        {b.customer_address}
                      </p>
                    )}
                  </DetailBlock>
                  <DetailBlock title="Event & venue">
                    <p>Date: {b.booking_date}</p>
                    <p>Guests: {b.guest_count}</p>
                    <p>Location: {b.location || '—'}</p>
                    <p>Confirmed: {b.is_confirmed ? 'Yes' : 'No'}</p>
                  </DetailBlock>
                  <DetailBlock title="Payment">
                    <p>Subtotal: {formatMoney(b.subtotal)}</p>
                    <p>Total: {formatMoney(b.total_amount)}</p>
                    <p>Advance (50%): {formatMoney(b.advance_amount)}</p>
                    <p className="font-medium text-green-700">
                      Paid: {formatMoney(b.amount_paid)}
                    </p>
                    <p className="font-medium text-red-700">
                      Remaining: {formatMoney(b.remaining_amount)}
                    </p>
                    <p className="mt-1 text-sm text-[#5b6470]">
                      Type: {b.payment_type || '—'} · Method:{' '}
                      {b.payment_method || '—'}
                    </p>
                    {b.paid_at && (
                      <p className="text-xs text-[#5b6470]">
                        Paid at: {new Date(b.paid_at).toLocaleString()}
                      </p>
                    )}
                  </DetailBlock>
                </div>

                {b.package_items?.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-[#8b5e34]">
                      Booked package
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-[#e8dfd4]">
                      <table className="w-full min-w-[480px] text-left text-sm">
                        <thead className="bg-[#faf7f2] text-xs uppercase text-[#5b6470]">
                          <tr>
                            <th className="px-4 py-2">Item</th>
                            <th className="px-4 py-2">Section</th>
                            <th className="px-4 py-2">Qty</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Line total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {b.package_items.map((item, i) => (
                            <tr
                              key={i}
                              className="border-t border-[#e8dfd4]"
                            >
                              <td className="px-4 py-2 font-medium">
                                {item.name}
                              </td>
                              <td className="px-4 py-2 text-[#5b6470]">
                                {item.section || '—'}
                              </td>
                              <td className="px-4 py-2">
                                {item.quantity ?? 1}
                              </td>
                              <td className="px-4 py-2">
                                {formatMoney(item.price)}
                              </td>
                              <td className="px-4 py-2 font-medium">
                                {formatMoney(
                                  item.line_total ??
                                    (item.price || 0) *
                                      (item.quantity ?? 1)
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {b.status === 'Rejected' && b.admin_notes && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm">
                    <p className="text-xs font-bold uppercase text-red-800">
                      Rejection reason (sent to customer)
                    </p>
                    <p className="mt-2 text-red-900">{b.admin_notes}</p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold uppercase text-[#8b5e34]">
                    Admin notes
                  </label>
                  <textarea
                    rows={2}
                    value={
                      notesDraft[b.id] !== undefined
                        ? notesDraft[b.id]
                        : b.admin_notes || ''
                    }
                    onChange={(e) =>
                      setNotesDraft((prev) => ({
                        ...prev,
                        [b.id]: e.target.value,
                      }))
                    }
                    placeholder="Internal notes for this booking…"
                    className={`${inputClass} mt-1`}
                  />
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => saveAdminNotes(b.id)}
                    className="mt-2 rounded-full border border-[#8b5e34] px-4 py-1.5 text-xs font-semibold text-[#8b5e34] hover:bg-[#faf7f2] disabled:opacity-50"
                  >
                    Save notes
                  </button>
                </div>

                <p className="text-xs text-[#5b6470]">
                  Created: {new Date(b.created_at).toLocaleString()}
                </p>

                {b.status === 'Pending' && b.payment_photo_url && (
                  <div className="flex flex-wrap gap-3 border-t border-[#e8dfd4] pt-4">
                    <button
                      type="button"
                      onClick={() => approveBooking(b.id, 'approve')}
                      className="rounded-full bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700"
                    >
                      Approve booking
                    </button>
                    <button
                      type="button"
                      onClick={() => openRejectModal(b)}
                      className="rounded-full border border-red-300 px-6 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      ) : (
        /* ─── EVENTS TAB ─── */
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-[#1f2937]">
              Events — Halls, Food, Decorations & Services
            </h2>
            {!showEventForm && (
              <button
                type="button"
                onClick={openNewEvent}
                className="rounded-full bg-[#8b5e34] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#714a28]"
              >
                + Add new event
              </button>
            )}
          </div>

          {showEventForm ? (
            <form
              onSubmit={saveEvent}
              className="card-3d glass-panel-3d space-y-6 p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-[#1f2937]">
                  {editingEvent ? 'Edit event' : 'Create new event'}
                </h3>
                <button
                  type="button"
                  onClick={cancelEventForm}
                  className="text-sm text-[#5b6470] hover:text-[#1f2937]"
                >
                  Cancel
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title" required>
                  <input
                    required
                    value={eventForm.title}
                    onChange={(e) =>
                      setEventForm((p) => ({ ...p, title: e.target.value }))
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Category">
                  <select
                    value={eventForm.category}
                    onChange={(e) =>
                      setEventForm((p) => ({
                        ...p,
                        category: e.target.value,
                      }))
                    }
                    className={inputClass}
                  >
                    {[
                      'Wedding',
                      'Birthday',
                      'Corporate',
                      'Engagement',
                      'Anniversary',
                      'Other',
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Location">
                  <input
                    value={eventForm.location}
                    onChange={(e) =>
                      setEventForm((p) => ({
                        ...p,
                        location: e.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Excerpt (short summary)">
                  <input
                    value={eventForm.excerpt}
                    onChange={(e) =>
                      setEventForm((p) => ({
                        ...p,
                        excerpt: e.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  rows={3}
                  value={eventForm.description}
                  onChange={(e) =>
                    setEventForm((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Cover image URLs (one per line)">
                {eventForm.images.map((url, i) => (
                  <div key={i} className="mb-2 flex gap-2">
                    <input
                      value={url}
                      onChange={(e) => {
                        const imgs = [...eventForm.images]
                        imgs[i] = e.target.value
                        setEventForm((p) => ({ ...p, images: imgs }))
                      }}
                      placeholder="https://…"
                      className={inputClass}
                    />
                    {eventForm.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setEventForm((p) => ({
                            ...p,
                            images: p.images.filter((_, j) => j !== i),
                          }))
                        }
                        className="shrink-0 text-red-600"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setEventForm((p) => ({
                      ...p,
                      images: [...p.images, ''],
                    }))
                  }
                  className="text-sm text-[#8b5e34] hover:underline"
                >
                  + Add image URL
                </button>
              </Field>

              {SECTIONS.map((section) => (
                <div
                  key={section}
                  className="rounded-2xl border border-[#e8dfd4] bg-[#faf7f2]/50 p-5"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-bold text-[#8b5e34]">{section}</h4>
                    <button
                      type="button"
                      onClick={() => addPricingItem(section)}
                      className="rounded-full border border-[#8b5e34] px-4 py-1 text-xs font-semibold text-[#8b5e34] hover:bg-white"
                    >
                      + Add {section === 'Function Halls' ? 'hall' : section.slice(0, -1).toLowerCase() || 'item'}
                    </button>
                  </div>

                  {pricingBySection(section).length === 0 ? (
                    <p className="text-sm text-[#5b6470]">
                      No items in this section yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {pricingBySection(section).map(({ item, index }) => (
                        <div
                          key={index}
                          className="rounded-xl border border-[#d9c9b8] bg-white p-4"
                        >
                          <div className="mb-3 flex justify-between">
                            <span className="text-xs font-semibold uppercase text-[#5b6470]">
                              Item
                            </span>
                            <button
                              type="button"
                              onClick={() => removePricingItem(index)}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <Field label="Name" compact>
                              <input
                                required
                                value={item.name}
                                onChange={(e) =>
                                  updatePricingItem(
                                    index,
                                    'name',
                                    e.target.value
                                  )
                                }
                                className={inputClass}
                              />
                            </Field>
                            <Field label="Price (₹)" compact>
                              <input
                                type="number"
                                min={0}
                                value={item.price}
                                onChange={(e) =>
                                  updatePricingItem(
                                    index,
                                    'price',
                                    e.target.value
                                  )
                                }
                                className={inputClass}
                              />
                            </Field>
                            <Field label="Type" compact>
                              <select
                                value={item.type || 'fixed'}
                                onChange={(e) =>
                                  updatePricingItem(
                                    index,
                                    'type',
                                    e.target.value
                                  )
                                }
                                className={inputClass}
                              >
                                <option value="fixed">Fixed price</option>
                                <option value="perPerson">Per person</option>
                              </select>
                            </Field>
                            {section === 'Food' && (
                              <Field label="Diet" compact>
                                <select
                                  value={item.diet || 'veg'}
                                  onChange={(e) =>
                                    updatePricingItem(
                                      index,
                                      'diet',
                                      e.target.value
                                    )
                                  }
                                  className={inputClass}
                                >
                                  <option value="veg">Veg</option>
                                  <option value="nonveg">Non-veg</option>
                                  <option value="both">Both</option>
                                </select>
                              </Field>
                            )}
                            <Field label="Image URL" compact className="sm:col-span-2">
                              <input
                                value={item.image || ''}
                                onChange={(e) =>
                                  updatePricingItem(
                                    index,
                                    'image',
                                    e.target.value
                                  )
                                }
                                className={inputClass}
                              />
                            </Field>
                            <Field label="Details" compact className="sm:col-span-2 lg:col-span-3">
                              <textarea
                                rows={2}
                                value={item.details || ''}
                                onChange={(e) =>
                                  updatePricingItem(
                                    index,
                                    'details',
                                    e.target.value
                                  )
                                }
                                className={inputClass}
                              />
                            </Field>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-[#8b5e34] px-8 py-3 text-sm font-semibold text-white hover:bg-[#714a28] disabled:opacity-60"
                >
                  {saving
                    ? 'Saving…'
                    : editingEvent
                      ? 'Update event'
                      : 'Create event'}
                </button>
                <button
                  type="button"
                  onClick={cancelEventForm}
                  className="rounded-full border border-[#d9c9b8] px-8 py-3 text-sm font-medium text-[#5b6470]"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {events.length === 0 ? (
                <p className="col-span-2 rounded-2xl border border-dashed border-[#d9c9b8] bg-white p-10 text-center text-[#5b6470]">
                  No events yet. Click &quot;Add new event&quot; to create one.
                </p>
              ) : (
                events.map((ev) => {
                  const counts = SECTIONS.reduce((acc, s) => {
                    acc[s] = (ev.pricing || []).filter(
                      (p) => p.section === s
                    ).length
                    return acc
                  }, {})
                  return (
                    <article
                      key={ev.id}
                      className="card-3d glass-panel-3d flex flex-col p-5"
                    >
                      {ev.images?.[0] && (
                        <img
                          src={ev.images[0]}
                          alt=""
                          className="mb-4 h-36 w-full rounded-xl object-cover"
                        />
                      )}
                      <h3 className="text-lg font-bold text-[#1f2937]">
                        {ev.title}
                      </h3>
                      <p className="text-sm text-[#8b5e34]">
                        {ev.category} · {ev.location}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-[#5b6470]">
                        {ev.excerpt || ev.description}
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-2 text-xs">
                        {SECTIONS.map((s) =>
                          counts[s] > 0 ? (
                            <li
                              key={s}
                              className="rounded-full bg-[#f8f5f0] px-2 py-1 text-[#5b6470]"
                            >
                              {s}: {counts[s]}
                            </li>
                          ) : null
                        )}
                      </ul>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openEditEvent(ev)}
                          className="rounded-full bg-[#8b5e34] px-4 py-2 text-sm font-medium text-white hover:bg-[#714a28]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteEvent(ev.id)}
                          className="rounded-full border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  )
                })
              )}
            </div>
          )}
        </div>
      )}

      {rejectModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={submitReject}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-[#1f2937]">
              Reject booking
            </h3>
            <p className="mt-2 text-sm text-[#5b6470]">
              {rejectModal.eventTitle} — the customer will receive an email with
              your reason and a note that refunds are processed within 24 hours.
            </p>

            {rejectModal.error && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {rejectModal.error}
              </p>
            )}

            <label className="mt-5 block text-xs font-semibold uppercase text-[#1f2937]">
              Reason for rejection *
            </label>
            <textarea
              required
              rows={4}
              value={rejectModal.reason}
              onChange={(e) =>
                setRejectModal((prev) => ({
                  ...prev,
                  reason: e.target.value,
                  error: '',
                }))
              }
              placeholder="e.g. Payment proof unclear, hall unavailable on requested date…"
              className={`${inputClass} mt-2`}
            />
            <p className="mt-2 text-xs text-[#5b6470]">
              Minimum 10 characters. This text is emailed to the customer.
            </p>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={closeRejectModal}
                className="rounded-full border border-[#d9c9b8] px-5 py-2 text-sm font-medium text-[#5b6470]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {saving ? 'Sending…' : 'Reject & notify customer'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}

function StatusBadge({ label, variant, status }) {
  let cls = 'bg-[#f8f5f0] text-[#5b6470]'
  if (variant === 'payment') {
    if (label === 'Paid Full') cls = 'bg-green-100 text-green-800'
    else if (label === 'Advance Paid') cls = 'bg-blue-100 text-blue-800'
    else if (label === 'Rejected') cls = 'bg-red-100 text-red-700'
    else cls = 'bg-amber-100 text-amber-800'
  } else if (variant === 'admin') {
    if (status === 'Approved') cls = 'bg-green-100 text-green-800'
    else if (status === 'Rejected') cls = 'bg-red-100 text-red-700'
    else cls = 'bg-yellow-100 text-yellow-800'
  }
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${cls}`}>
      {label}
    </span>
  )
}

function DetailBlock({ title, children }) {
  return (
    <div className="rounded-xl border border-[#e8dfd4] bg-[#faf7f2]/40 p-4 text-sm">
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#8b5e34]">
        {title}
      </h4>
      {children}
    </div>
  )
}

function Field({ label, children, required, compact, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span
        className={`font-semibold uppercase text-[#1f2937] ${
          compact ? 'text-[10px]' : 'text-xs'
        }`}
      >
        {label}
        {required && ' *'}
      </span>
      {children}
    </label>
  )
}
