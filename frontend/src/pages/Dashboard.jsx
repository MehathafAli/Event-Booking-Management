/*import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'

const statusStyle = {
  Paid: 'bg-green-100 text-green-800',
  Pending: 'bg-amber-100 text-amber-800',
  Rejected: 'bg-red-100 text-red-800',
  Unpaid: 'bg-slate-100 text-slate-700',
}

export default function Dashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await API.get('my-bookings/')
        setBookings(response.data)
      } catch {
        setError('Could not load your bookings. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  return (
    <section className="perspective-scene min-h-screen py-16">
      <section className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <p className="inline-flex rounded-full border border-[#d6c3af] bg-white/80 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8b5e34]">
          My Account
        </p>

        <h1 className="mt-6 text-4xl font-bold text-[#1f2937]">My Bookings</h1>
        <p className="mt-3 text-[#5b6470]">
          Status shows Pending until admin verifies your payment photo, then Paid.
        </p>

        {loading && (
          <p className="mt-12 text-center text-[#5b6470]">Loading bookings...</p>
        )}

        {error && (
          <p className="mt-12 rounded-[1.5rem] bg-red-50 px-5 py-4 text-red-700">
            {error}
          </p>
        )}

        {!loading && !error && bookings.length === 0 && (
          <section className="mt-12 glass-panel-3d p-10 text-center">
            <p className="text-lg text-[#5b6470]">You have not booked any events yet.</p>
            <Link
              to="/events"
              className="btn-3d mt-6 inline-block rounded-full bg-[#8b5e34] px-8 py-3 text-sm text-white"
            >
              Browse Events
            </Link>
          </section>
        )}

        <ul className="mt-10 space-y-6 list-none p-0">
          {bookings.map((booking) => {
            const label = booking.display_status || 'Unpaid'
            return (
              <li key={booking.id} className="card-3d glass-panel-3d p-6 sm:p-8">
                <header className="flex flex-wrap items-start justify-between gap-4">
                  <section>
                    <p className="text-xs font-semibold uppercase text-[#8b5e34]">
                      {booking.event_category}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold">{booking.event_title}</h2>
                    <p className="mt-2 text-sm text-[#5b6470]">
                      Event date: {booking.booking_date}
                    </p>
                  </section>
                  <span
                    className={`rounded-full px-4 py-2 text-xs font-bold ${
                      statusStyle[label] || statusStyle.Unpaid
                    }`}
                  >
                    {label}
                  </span>
                </header>

                <section className="mt-6 grid gap-4 sm:grid-cols-3">
                  <article className="rounded-[1.25rem] bg-[#f8f5f0] p-4">
                    <p className="text-xs text-[#5b6470]">Total</p>
                    <p className="mt-1 text-lg font-bold">
                      ₹{booking.total_amount?.toLocaleString()}
                    </p>
                  </article>
                  <article className="rounded-[1.25rem] bg-[#f8f5f0] p-4">
                    <p className="text-xs text-[#5b6470]">Submitted</p>
                    <p className="mt-1 text-lg font-bold text-[#8b5e34]">
                      ₹{booking.amount_paid?.toLocaleString()}
                    </p>
                  </article>
                  <article className="rounded-[1.25rem] bg-[#f8f5f0] p-4">
                    <p className="text-xs text-[#5b6470]">Admin status</p>
                    <p className="mt-1 text-lg font-bold">{booking.status}</p>
                  </article>
                </section>

                <footer className="mt-6 flex flex-wrap gap-3">
                  {label === 'Unpaid' && booking.is_confirmed && (
                    <Link
                      to={`/payment/${booking.id}`}
                      className="btn-3d rounded-full bg-[#8b5e34] px-6 py-2.5 text-sm text-white"
                    >
                      Upload Payment Photo
                    </Link>
                  )}
                  {!booking.is_confirmed && (
                    <Link
                      to={`/booking-success/${booking.id}`}
                      className="rounded-full bg-[#8b5e34] px-6 py-2.5 text-sm text-white"
                    >
                      Complete Booking
                    </Link>
                  )}
                  <Link
                    to={`/booking-success/${booking.id}`}
                    className="rounded-full border border-[#d9c9b8] px-6 py-2.5 text-sm text-[#5b6470]"
                  >
                    View Details
                  </Link>
                </footer>
              </li>
            )
          })}
        </ul>
      </section>
    </section>
  )
}*/


import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'

const statusStyle = {
  'Paid Full': 'bg-green-100 text-green-800',

  'Advance Paid':
    'bg-blue-100 text-blue-800',

  Pending:
    'bg-amber-100 text-amber-800',

  Rejected:
    'bg-red-100 text-red-800',

  Unpaid:
    'bg-slate-100 text-slate-700',

  'Payment Verification Pending':
    'bg-yellow-100 text-yellow-800',
}

export default function Dashboard() {
  const [bookings, setBookings] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await API.get(
          'my-bookings/'
        )

        setBookings(response.data)
      } catch {
        setError(
          'Could not load your bookings. Please try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  return (
    <section className="perspective-scene min-h-screen py-16">
      <section className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <p className="inline-flex rounded-full border border-[#d6c3af] bg-white/80 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8b5e34]">
          My Account
        </p>

        <h1 className="mt-6 text-4xl font-bold text-[#1f2937]">
          My Bookings
        </h1>

        <p className="mt-3 text-[#5b6470]">
          Status shows pending until
          admin verifies your payment.
        </p>

        {loading && (
          <p className="mt-12 text-center text-[#5b6470]">
            Loading bookings...
          </p>
        )}

        {error && (
          <p className="mt-12 rounded-[1.5rem] bg-red-50 px-5 py-4 text-red-700">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          bookings.length === 0 && (
            <section className="mt-12 glass-panel-3d p-10 text-center">
              <p className="text-lg text-[#5b6470]">
                You have not booked any
                events yet.
              </p>

              <Link
                to="/events"
                className="btn-3d mt-6 inline-block rounded-full bg-[#8b5e34] px-8 py-3 text-sm text-white"
              >
                Browse Events
              </Link>
            </section>
          )}

        <ul className="mt-10 space-y-6 list-none p-0">
          {bookings.map((booking) => {
            const label =
              booking.display_status ||
              'Unpaid'

            return (
              <li
                key={booking.id}
                className="card-3d glass-panel-3d p-6 sm:p-8"
              >
                {/* HEADER */}

                <header className="flex flex-wrap items-start justify-between gap-4">
                  <section>
                    <p className="text-xs font-semibold uppercase text-[#8b5e34]">
                      {
                        booking.event_category
                      }
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                      {
                        booking.event_title
                      }
                    </h2>

                    <p className="mt-2 text-sm text-[#5b6470]">
                      Event date:{' '}
                      {
                        booking.booking_date
                      }
                    </p>
                  </section>

                  <span
                    className={`rounded-full px-4 py-2 text-xs font-bold ${
                      statusStyle[
                        label
                      ] ||
                      statusStyle.Unpaid
                    }`}
                  >
                    {label}
                  </span>
                </header>

                {/* CARDS */}

                <section className="mt-6 grid gap-4 sm:grid-cols-4">

                  {/* TOTAL */}

                  <article className="rounded-[1.25rem] bg-[#f8f5f0] p-4">
                    <p className="text-xs text-[#5b6470]">
                      Total
                    </p>

                    <p className="mt-1 text-lg font-bold">
                      ₹
                      {booking.total_amount?.toLocaleString()}
                    </p>
                  </article>

                  {/* PAID */}

                  <article className="rounded-[1.25rem] bg-[#f8f5f0] p-4">
                    <p className="text-xs text-[#5b6470]">
                      Paid
                    </p>

                    <p className="mt-1 text-lg font-bold text-[#8b5e34]">
                      ₹
                      {booking.amount_paid?.toLocaleString()}
                    </p>
                  </article>

                  {/* REMAINING */}

                  <article className="rounded-[1.25rem] bg-[#f8f5f0] p-4">
                    <p className="text-xs text-[#5b6470]">
                      Remaining
                    </p>

                    <p className="mt-1 text-lg font-bold text-red-500">
                      ₹
                      {booking.remaining_amount?.toLocaleString()}
                    </p>
                  </article>

                  {/* ADMIN */}

                  <article className="rounded-[1.25rem] bg-[#f8f5f0] p-4">
                    <p className="text-xs text-[#5b6470]">
                      Admin Status
                    </p>

                    <p className="mt-1 text-lg font-bold">
                      {booking.status}
                    </p>
                  </article>
                </section>

                {/* FOOTER */}

                <footer className="mt-6 flex flex-wrap gap-3">

                  {/* PAYMENT */}

                  {booking.is_confirmed &&
                    booking.remaining_amount >
                      0 && (
                      <Link
                        to={`/payment/${booking.id}`}
                        className="btn-3d rounded-full bg-[#8b5e34] px-6 py-2.5 text-sm text-white"
                      >
                        {booking.amount_paid >
                        0
                          ? `Pay Remaining ₹${booking.remaining_amount.toLocaleString()}`
                          : 'Upload Payment Photo'}
                      </Link>
                    )}

                  {/* COMPLETE */}

                  {!booking.is_confirmed && (
                    <Link
                      to={`/booking-success/${booking.id}`}
                      className="rounded-full bg-[#8b5e34] px-6 py-2.5 text-sm text-white"
                    >
                      Complete Booking
                    </Link>
                  )}

                  {/* DETAILS */}

                  <Link
                    to={`/booking-success/${booking.id}`}
                    className="rounded-full border border-[#d9c9b8] px-6 py-2.5 text-sm text-[#5b6470]"
                  >
                    View Details
                  </Link>
                </footer>
              </li>
            )
          })}
        </ul>
      </section>
    </section>
  )
}
