import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import API from '../services/api'

const statusStyle = {
  'Paid Full': 'bg-green-100 text-green-800',
  'Advance Paid': 'bg-blue-100 text-blue-800',
  'Pending Approval': 'bg-amber-100 text-amber-800',
  Rejected: 'bg-red-100 text-red-700',
  Unpaid: 'bg-slate-100 text-slate-700',
}

export default function BookingDetails() {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get(`bookings/${id}/`)
        setBooking(res.data)
      } catch {
        setError('Could not load booking details.')
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  if (loading) {
    return (
      <p className="flex min-h-[50vh] items-center justify-center text-[#5b6470]">
        Loading booking details…
      </p>
    )
  }

  if (error || !booking) {
    return (
      <section className="mx-auto max-w-xl glass-panel-3d p-10 text-center">
        <p className="text-red-600">{error || 'Booking not found.'}</p>
        <Link to="/dashboard" className="mt-6 inline-block text-[#8b5e34] font-semibold">
          Back to Dashboard
        </Link>
      </section>
    )
  }

  const items = booking.package_items || []
  const label = booking.display_status || 'Unpaid'

  return (
    <section className="perspective-scene min-h-screen py-16">
      <div className="mx-auto max-w-[900px] px-5 sm:px-8">
        <Link
          to="/dashboard"
          className="text-sm font-semibold text-[#8b5e34] hover:underline"
        >
          ← Back to My Bookings
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b5e34]">
              {booking.event_category}
            </p>
            <h1 className="mt-2 text-4xl font-bold text-[#1f2937]">
              {booking.event_title}
            </h1>
            <p className="mt-2 text-[#5b6470]">
              Booking #{booking.id} · Event date: {booking.booking_date}
            </p>
          </div>
          <span
            className={`rounded-full px-4 py-2 text-xs font-bold ${
              statusStyle[label] || statusStyle.Unpaid
            }`}
          >
            {label}
          </span>
        </div>

        {booking.status === 'Rejected' && booking.admin_notes && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm">
            <p className="font-bold text-red-800">Rejection reason</p>
            <p className="mt-2 text-red-900">{booking.admin_notes}</p>
            {booking.amount_paid > 0 && (
              <p className="mt-3 font-medium text-red-800">
                Refund of ₹{booking.amount_paid?.toLocaleString()} will be
                processed within 24 hours.
              </p>
            )}
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-[#e8dfd4] bg-white p-5">
            <h2 className="text-sm font-bold uppercase text-[#8b5e34]">
              Your details
            </h2>
            <p className="mt-3 text-sm text-[#1f2937]">
              {booking.customer_name || '—'}
            </p>
            <p className="text-sm text-[#5b6470]">{booking.customer_phone}</p>
            <p className="text-sm text-[#5b6470]">{booking.customer_email}</p>
            {booking.customer_address && (
              <p className="mt-2 text-sm text-[#5b6470]">
                {booking.customer_address}
              </p>
            )}
          </article>
          <article className="rounded-2xl border border-[#e8dfd4] bg-white p-5">
            <h2 className="text-sm font-bold uppercase text-[#8b5e34]">
              Payment summary
            </h2>
            <div className="mt-3 space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-[#5b6470]">Total</span>
                <span className="font-semibold">
                  ₹{booking.total_amount?.toLocaleString()}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#5b6470]">Paid</span>
                <span className="font-semibold text-green-700">
                  ₹{booking.amount_paid?.toLocaleString()}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#5b6470]">Remaining</span>
                <span className="font-semibold text-red-600">
                  ₹{booking.remaining_amount?.toLocaleString()}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#5b6470]">Admin status</span>
                <span className="font-semibold">{booking.status}</span>
              </p>
            </div>
          </article>
        </div>

        <div className="mt-8 rounded-[2.5rem] bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-[#1f2937]">Booked package</h2>
          <div className="mt-6 space-y-3">
            {items.length === 0 ? (
              <p className="text-[#5b6470]">No package items recorded.</p>
            ) : (
              items.map((item, i) => (
                <div
                  key={`${item.name}-${i}`}
                  className="flex items-center justify-between rounded-[1.25rem] bg-[#f8f5f0] px-5 py-4"
                >
                  <div>
                    <p className="font-semibold text-[#1f2937]">{item.name}</p>
                    <p className="text-xs text-[#5b6470]">
                      {item.section || 'Package'} · Qty: {item.quantity ?? 1}
                    </p>
                  </div>
                  <p className="font-bold text-[#8b5e34]">
                    ₹
                    {(
                      item.line_total ??
                      (item.price || 0) * (item.quantity ?? 1)
                    ).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="mt-8 flex justify-between border-t border-[#ece3d9] pt-6 text-xl font-bold">
            <span>Total</span>
            <span>₹{booking.total_amount?.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={`/events/${booking.event}`}
            className="btn-3d rounded-full bg-[#8b5e34] px-6 py-3 text-sm text-white"
          >
            View event page
          </Link>
          {booking.remaining_amount > 0 && booking.is_confirmed && (
            <Link
              to={`/payment/${booking.id}`}
              className="rounded-full border border-[#8b5e34] px-6 py-3 text-sm font-semibold text-[#8b5e34]"
            >
              Pay remaining ₹{booking.remaining_amount?.toLocaleString()}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
