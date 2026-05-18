import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import API from '../services/api'

export default function BookingSuccess() {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    async function fetchBooking() {
      try {
        const response = await API.get(`bookings/${id}/`)
        setBooking(response.data)
        if (response.data.is_confirmed) {
          setSuccessMessage(
            'Slot booked! Our team will contact you in 30 min.'
          )
        }
      } catch {
        setFetchError('Unable to load booking details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBooking()
    } else {
      setFetchError('Invalid booking reference.')
      setLoading(false)
    }
  }, [id])

  const handleChange = (field) => (e) => {
    setCustomerDetails((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitting(true)

    try {
      const response = await API.patch(`bookings/${id}/confirm/`, {
        customer_name: customerDetails.fullName,
        customer_phone: customerDetails.phone,
        customer_email: customerDetails.email,
        customer_address: customerDetails.address,
      })
      setSuccessMessage(
        response.data.message ||
          'Slot booked! Our team will contact you in 30 min.'
      )
      if (response.data.booking) {
        setBooking(response.data.booking)
      }
    } catch (err) {
      const data = err.response?.data
      const firstError =
        data?.customer_name?.[0] ||
        data?.customer_phone?.[0] ||
        data?.customer_email?.[0] ||
        data?.detail ||
        'Failed to submit details. Please try again.'
      setSubmitError(firstError)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg text-[#5b6470]">Loading booking details...</p>
      </div>
    )
  }

  if (fetchError || !booking) {
    return (
      <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-10 text-center shadow-lg">
        <p className="text-red-600">{fetchError || 'Booking not found.'}</p>
        <Link
          to="/events"
          className="mt-6 inline-block rounded-full bg-[#8b5e34] px-6 py-3 text-sm font-semibold text-white"
        >
          Back to Events
        </Link>
      </div>
    )
  }

  const items = booking.package_items || []

  return (
    <div className="min-h-screen bg-[#f8f5f0] py-16">
      <div className="mx-auto max-w-[900px] px-5 sm:px-8">
        <div className="inline-flex rounded-full border border-[#d6c3af] bg-white/80 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8b5e34]">
          Booking Summary
        </div>

        <h1 className="mt-6 text-4xl font-bold text-[#1f2937]">
          {booking.event_title}
        </h1>
        <p className="mt-2 text-sm text-[#5b6470]">{booking.event_category}</p>

        <div className="mt-10 rounded-[2.5rem] bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-[#1f2937]">Package Details</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[#f8f5f0] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8b5e34]">
                Event Date
              </p>
              <p className="mt-2 font-semibold text-[#1f2937]">
                {booking.booking_date}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[#f8f5f0] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8b5e34]">
                Guest Count
              </p>
              <p className="mt-2 font-semibold text-[#1f2937]">
                {booking.guest_count}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {items.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-[1.25rem] bg-[#f8f5f0] px-5 py-4"
              >
                <div>
                  <p className="font-semibold text-[#1f2937]">{item.name}</p>
                  <p className="text-xs text-[#5b6470]">
                    Qty: {item.quantity}
                    {item.type === 'perPerson' ? ' · per guest' : ''}
                  </p>
                </div>
                <p className="font-bold text-[#8b5e34]">
                  ₹{(item.line_total ?? item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between border-t border-[#ece3d9] pt-6 text-xl font-bold text-[#1f2937]">
            <span>Total</span>
            <span>₹{booking.total_amount.toLocaleString()}</span>
          </div>
        </div>

        {successMessage ? (
          <div className="mt-10 rounded-[2rem] border border-green-200 bg-green-50 p-8 text-center shadow-lg">
            <p className="text-2xl font-bold text-green-800">✓ {successMessage}</p>
            <Link
              to="/events"
              className="mt-6 inline-block rounded-full bg-[#8b5e34] px-8 py-3 text-sm font-semibold text-white"
            >
              Browse More Events
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-[2.5rem] bg-white p-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-[#1f2937]">Your Details</h2>
            <p className="mt-2 text-sm text-[#5b6470]">
              Fill in your contact information to confirm your slot.
            </p>

            {submitError && (
              <div className="mt-6 rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

            <div className="mt-8 space-y-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-[#1f2937]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customerDetails.fullName}
                  onChange={handleChange('fullName')}
                  required
                  className="mt-2 w-full rounded-xl border border-[#d9c9b8] bg-[#faf7f2] px-4 py-3 text-sm outline-none focus:border-[#8b5e34]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-[#1f2937]">
                  Phone
                </label>
                <input
                  type="tel"
                  value={customerDetails.phone}
                  onChange={handleChange('phone')}
                  required
                  className="mt-2 w-full rounded-xl border border-[#d9c9b8] bg-[#faf7f2] px-4 py-3 text-sm outline-none focus:border-[#8b5e34]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-[#1f2937]">
                  Email
                </label>
                <input
                  type="email"
                  value={customerDetails.email}
                  onChange={handleChange('email')}
                  required
                  className="mt-2 w-full rounded-xl border border-[#d9c9b8] bg-[#faf7f2] px-4 py-3 text-sm outline-none focus:border-[#8b5e34]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-[#1f2937]">
                  Address
                </label>
                <textarea
                  value={customerDetails.address}
                  onChange={handleChange('address')}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-[#d9c9b8] bg-[#faf7f2] px-4 py-3 text-sm outline-none focus:border-[#8b5e34]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 w-full rounded-full bg-[#8b5e34] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#714a28] disabled:cursor-not-allowed disabled:bg-[#d8cabb]"
            >
              {submitting ? 'Submitting...' : 'Confirm Booking'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
