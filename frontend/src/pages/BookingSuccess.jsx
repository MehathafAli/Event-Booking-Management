import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import API from '../services/api'
import {
  normalizePhone,
  validateCustomerDetails,
} from '../utils/validation'

export default function BookingSuccess() {
  const { id } = useParams()
  const navigate = useNavigate()
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
  const [fieldErrors, setFieldErrors] = useState({})
  useEffect(() => {
    async function fetchBooking() {
      try {
        const response = await API.get(`bookings/${id}/`)
        setBooking(response.data)
        if (
          response.data.is_confirmed &&
          response.data.payment_status !== 'paid_full'
        ) {
          navigate(`/payment/${id}`, { replace: true })
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
  }, [id, navigate])

  const handleChange = (field) => (e) => {
    const value = e.target.value
    setCustomerDetails((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    const errors = validateCustomerDetails(customerDetails)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    setSubmitting(true)

    try {
      await API.patch(`bookings/${id}/confirm/`, {
        customer_name: customerDetails.fullName.trim(),
        customer_phone: normalizePhone(customerDetails.phone),
        customer_email: customerDetails.email.trim().toLowerCase(),
        customer_address: customerDetails.address,
      })
      navigate(`/payment/${id}`)
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
    <div className="perspective-scene min-h-screen py-16">
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

          <div className="mt-6">
            <div className="rounded-[1.5rem] bg-[#f8f5f0] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8b5e34]">
                Event Date
              </p>
              <p className="mt-2 font-semibold text-[#1f2937]">
                {booking.booking_date}
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

        <form
            onSubmit={handleSubmit}
            className="glass-panel-3d mt-10 p-8"
          >
            <h2 className="text-2xl font-bold text-[#1f2937]">Your Details</h2>
            <p className="mt-2 text-sm text-[#5b6470]">
              Fill in your details to continue to secure payment.
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
                  className="input-3d mt-2 text-sm"
                />
                {fieldErrors.fullName && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.fullName}</p>
                )}
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
                  inputMode="numeric"
                  pattern="[6-9][0-9]{9}"
                  maxLength={14}
                  placeholder="9876543210"
                  className="input-3d mt-2 text-sm"
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
                )}
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
                  placeholder="you@example.com"
                  className="input-3d mt-2 text-sm"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-[#1f2937]">
                  Address
                </label>
                <textarea
                  value={customerDetails.address}
                  onChange={handleChange('address')}
                  rows={3}
                  className="textarea-3d mt-2 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-3d mt-8 w-full rounded-full bg-[#8b5e34] px-6 py-3 text-base text-white disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Continue to Payment'}
            </button>
          </form>
      </div>
    </div>
  )
}
