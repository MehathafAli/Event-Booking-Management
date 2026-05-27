/*import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'

const methods = [
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
  { id: 'wallet', label: 'Wallet', icon: '👛' },
]

export default function Payment() {
  const { id } = useParams()
  const { user } = useAuth()

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [paymentPhoto, setPaymentPhoto] = useState(null)
  const [preview, setPreview] = useState('')
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const response = await API.get(`bookings/${id}/`)
        setBooking(response.data)
        if (
          response.data.payment_status === 'pending_review' ||
          (response.data.status === 'Approved' &&
            response.data.payment_status === 'paid_full')
        ) {
          setSubmitted(true)
        }
      } catch {
        setFetchError('Unable to load booking for payment.')
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    setPaymentPhoto(file || null)
    if (file) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview('')
    }
  }

  const handlePay = async (e) => {
    e.preventDefault()
    setPayError('')

    if (!paymentPhoto) {
      setPayError('Please upload a payment screenshot or receipt photo.')
      return
    }

    setPaying(true)
    const formData = new FormData()
    formData.append('payment_type', 'full')
    formData.append('payment_method', paymentMethod)
    formData.append('payment_photo', paymentPhoto)

    try {
      const response = await API.post(`bookings/${id}/pay/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setBooking(response.data.booking)
      setSubmitted(true)
    } catch (err) {
      const data = err.response?.data
      setPayError(
        data?.payment_photo?.[0] ||
          data?.detail ||
          'Payment upload failed. Please try again.'
      )
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <p className="flex min-h-[50vh] items-center justify-center text-[#5b6470]">
        Loading payment...
      </p>
    )
  }

  if (fetchError || !booking) {
    return (
      <section className="mx-auto max-w-xl glass-panel-3d p-10 text-center">
        <p className="text-red-600">{fetchError || 'Booking not found.'}</p>
        <Link to="/events" className="mt-6 inline-block text-[#8b5e34] font-semibold">
          Back to Events
        </Link>
      </section>
    )
  }

  if (!booking.is_confirmed) {
    return (
      <section className="mx-auto max-w-xl glass-panel-3d p-10 text-center">
        <p className="text-[#5b6470]">
          Please complete your contact details before payment.
        </p>
        <Link
          to={`/booking-success/${id}`}
          className="btn-3d mt-6 inline-block rounded-full bg-[#8b5e34] px-8 py-3 text-sm text-white"
        >
          Complete Details
        </Link>
      </section>
    )
  }

  if (submitted) {
    const isPaid = booking.display_status === 'Paid' || booking.status === 'Approved'
    return (
      <section className="perspective-scene min-h-screen py-16">
        <article className="mx-auto max-w-xl glass-panel-3d p-10 text-center">
          <p className="text-5xl">{isPaid ? '✓' : '⏳'}</p>
          <h1 className="mt-4 text-3xl font-bold text-[#1f2937]">
            {isPaid ? 'Booking Paid' : 'Payment Submitted'}
          </h1>
          <p className="mt-4 text-[#5b6470]">
            {isPaid
              ? `Your booking for ${booking.event_title} is approved.`
              : `Payment proof received for ${booking.event_title}. Status is Pending until admin approves.`}
          </p>
          <p className="mt-4 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800 inline-block">
            Status: {booking.display_status || 'Pending'}
          </p>
          {user ? (
            <Link
              to="/dashboard"
              className="btn-3d mt-8 inline-block rounded-full bg-[#8b5e34] px-8 py-3 text-sm text-white"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              state={{ from: '/dashboard' }}
              className="btn-3d mt-8 inline-block rounded-full bg-[#8b5e34] px-8 py-3 text-sm text-white"
            >
              Login to View Dashboard
            </Link>
          )}
        </article>
      </section>
    )
  }

  return (
    <section className="perspective-scene min-h-screen py-16">
      <section className="mx-auto max-w-[900px] px-5 sm:px-8">
        <p className="inline-flex rounded-full border border-[#d6c3af] bg-white/80 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8b5e34]">
          Secure Checkout
        </p>

        <h1 className="mt-6 text-4xl font-bold text-[#1f2937]">Upload Payment Proof</h1>
        <p className="mt-2 text-[#5b6470]">{booking.event_title}</p>

        <form
          onSubmit={handlePay}
          className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]"
        >
          <section className="glass-panel-3d p-8">
            <h2 className="text-xl font-bold">Payment method</h2>
            <fieldset className="mt-4 grid gap-3 sm:grid-cols-2">
              {methods.map((m) => (
                <label
                  key={m.id}
                  className="flex cursor-pointer items-center gap-3 rounded-[1.25rem] border-2 border-[#ece3d9] p-4 has-[:checked]:border-[#8b5e34] has-[:checked]:bg-[#faf7f2]"
                >
                  <input
                    type="radio"
                    name="method"
                    value={m.id}
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id)}
                    className="accent-[#8b5e34]"
                  />
                  <span>{m.icon}</span>
                  <span className="text-sm font-semibold">{m.label}</span>
                </label>
              ))}
            </fieldset>

            <h2 className="mt-10 text-xl font-bold text-[#1f2937]">
              Upload payment photo <span className="text-red-600">*</span>
            </h2>
            <p className="mt-2 text-sm text-[#5b6470]">
              Upload UPI screenshot, bank receipt, or transaction photo. Booking completes only after upload.
            </p>
            <input
              type="file"
              accept="image/*"
              required
              onChange={handlePhotoChange}
              className="input-3d mt-4 file:mr-4 file:rounded-full file:border-0 file:bg-[#8b5e34] file:px-4 file:py-2 file:text-white"
            />
            {preview && (
              <img
                src={preview}
                alt="Payment preview"
                className="mt-4 h-48 rounded-2xl object-cover shadow-lg"
              />
            )}

            {payError && (
              <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {payError}
              </p>
            )}
          </section>

          <aside className="glass-panel-3d h-fit p-8 lg:sticky lg:top-8">
            <h2 className="text-lg font-bold">Order summary</h2>
            <p className="mt-2 text-sm text-[#5b6470]">
              Event date: {booking.booking_date}
            </p>
            <hr className="my-6 border-[#ece3d9]" />
            <p className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-[#8b5e34]">
                ₹{booking.total_amount.toLocaleString()}
              </span>
            </p>
            <button
              type="submit"
              disabled={paying || !paymentPhoto}
              className="btn-3d mt-8 w-full rounded-full bg-[#8b5e34] py-3.5 text-white disabled:opacity-60"
            >
              {paying ? 'Uploading...' : 'Submit Payment & Book'}
            </button>
          </aside>
        </form>
      </section>
    </section>
  )
}
*/

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'

const methods = [
  { id: 'upi', label: 'UPI', icon: '📱' },

  {
    id: 'card',
    label: 'Credit / Debit Card',
    icon: '💳',
  },

  {
    id: 'netbanking',
    label: 'Net Banking',
    icon: '🏦',
  },

  {
    id: 'wallet',
    label: 'Wallet',
    icon: '👛',
  },
]

export default function Payment() {
  const { id } = useParams()

  const { user } = useAuth()

  const [booking, setBooking] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [fetchError, setFetchError] =
    useState('')

  const [paymentMethod, setPaymentMethod] =
    useState('upi')

  const [paymentType, setPaymentType] =
    useState('advance')

  const [paymentPhoto, setPaymentPhoto] =
    useState(null)

  const [preview, setPreview] =
    useState('')

  const [paying, setPaying] =
    useState(false)

  const [payError, setPayError] =
    useState('')

  const [submitted, setSubmitted] =
    useState(false)

  useEffect(() => {
    async function load() {
      try {
        const response = await API.get(
          `bookings/${id}/`
        )

        const data = response.data
        setBooking(data)

        const remaining =
          data.remaining_amount ??
          Math.max(
            0,
            (data.total_amount || 0) - (data.amount_paid || 0)
          )
        const canPayRemaining =
          data.is_confirmed &&
          remaining > 0 &&
          data.payment_status !== 'paid_full'

        if (data.payment_status === 'pending_review') {
          setSubmitted(true)
        } else if (
          data.payment_status === 'paid_full' ||
          remaining <= 0
        ) {
          setSubmitted(true)
        } else if (canPayRemaining) {
          setSubmitted(false)
          setPaymentType(
            (data.amount_paid || 0) > 0 ? 'full' : 'advance'
          )
        } else if (
          data.status === 'Pending' &&
          (data.amount_paid || 0) > 0
        ) {
          setSubmitted(true)
        } else {
          setSubmitted(false)
          setPaymentType(
            (data.amount_paid || 0) > 0 ? 'full' : 'advance'
          )
        }
      } catch {
        setFetchError(
          'Unable to load booking for payment.'
        )
      } finally {
        setLoading(false)
      }
    }

    if (id) load()
  }, [id])

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]

    setPaymentPhoto(file || null)

    if (file) {
      setPreview(
        URL.createObjectURL(file)
      )
    } else {
      setPreview('')
    }
  }

const alreadyPaid =
  booking?.amount_paid > 0

const payableAmount =
  paymentType === 'advance'
    ? booking?.advance_amount || 0
    : booking?.remaining_amount ||
      booking?.total_amount ||
      0

const remainingAmount =
  booking?.remaining_amount || 0

  const handlePay = async (e) => {
    e.preventDefault()

    setPayError('')

    if (!paymentPhoto) {
      setPayError(
        'Please upload payment screenshot or receipt.'
      )

      return
    }

    setPaying(true)

    const formData = new FormData()

    formData.append(
      'payment_type',
      paymentType
    )

    formData.append(
      'payment_method',
      paymentMethod
    )

    formData.append(
      'payment_photo',
      paymentPhoto
    )

    try {
      const response = await API.post(
        `bookings/${id}/pay/`,
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      )

      setBooking(response.data.booking)

      setSubmitted(true)
    } catch (err) {
      const data = err.response?.data

      setPayError(
        data?.payment_photo?.[0] ||
          data?.detail ||
          'Payment upload failed.'
      )
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <p className="flex min-h-[50vh] items-center justify-center text-[#5b6470]">
        Loading payment...
      </p>
    )
  }

  if (fetchError || !booking) {
    return (
      <section className="mx-auto max-w-xl glass-panel-3d p-10 text-center">
        <p className="text-red-600">
          {fetchError ||
            'Booking not found.'}
        </p>

        <Link
          to="/events"
          className="mt-6 inline-block font-semibold text-[#8b5e34]"
        >
          Back to Events
        </Link>
      </section>
    )
  }

  if (!booking.is_confirmed) {
    return (
      <section className="mx-auto max-w-xl glass-panel-3d p-10 text-center">
        <p className="text-[#5b6470]">
          Please complete your contact details before payment.
        </p>
        <Link
          to={`/booking-success/${id}`}
          className="btn-3d mt-6 inline-block rounded-full bg-[#8b5e34] px-8 py-3 text-sm text-white"
        >
          Complete Details
        </Link>
      </section>
    )
  }

  if (submitted) if (submitted) {

  const isPaid =
    booking.payment_status ===
    'paid_full'

  return (

    <section className="perspective-scene relative min-h-screen overflow-hidden py-16">

      {/* BACKGROUND GLOW */}

      <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-green-300/20 blur-3xl" />

      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-[#8b5e34]/20 blur-3xl" />

      {/* FLOATING ICONS */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <span className="absolute left-[10%] top-[15%] animate-bounce text-5xl opacity-20">
          🎉
        </span>

        <span className="absolute right-[15%] top-[20%] animate-pulse text-4xl opacity-20">
          ✨
        </span>

        <span className="absolute bottom-[20%] left-[20%] animate-bounce text-4xl opacity-20">
          💖
        </span>

        <span className="absolute bottom-[15%] right-[20%] animate-pulse text-5xl opacity-20">
          💸
        </span>

      </div>

      <article className="relative mx-auto max-w-3xl overflow-hidden rounded-[3rem] border border-white/30 bg-white/80 p-10 text-center shadow-2xl backdrop-blur-xl">

        {/* SUCCESS ICON */}

        <div className="relative mx-auto flex h-44 w-44 items-center justify-center">

          {/* GLOW */}

          <div className="absolute inset-0 animate-pulse rounded-full bg-green-400/30 blur-3xl" />

          {/* OUTER RING */}

          <div className="absolute h-40 w-40 animate-spin-slow rounded-full border-4 border-dashed border-green-300/40" />

          {/* INNER */}

          <div
            className={`relative flex h-32 w-32 items-center justify-center rounded-full shadow-2xl ${
              isPaid
                ? 'bg-gradient-to-br from-green-400 to-emerald-600'
                : 'bg-gradient-to-br from-[#8b5e34] to-[#d2a679]'
            }`}
          >

            <span className="animate-bounce text-7xl text-white">

              {isPaid ? '✓' : '❤'}

            </span>

          </div>

          {/* FLOATING */}

          <span className="absolute left-0 top-6 animate-bounce text-4xl">
            🎊
          </span>

          <span className="absolute right-0 top-8 animate-pulse text-4xl">
            ✨
          </span>

          <span className="absolute bottom-3 left-6 animate-bounce text-3xl">
            💖
          </span>

          <span className="absolute bottom-4 right-5 animate-pulse text-3xl">
            💸
          </span>

        </div>

        {/* TITLE */}

        <h1 className="mt-10 bg-gradient-to-r from-[#1f2937] to-[#8b5e34] bg-clip-text text-5xl font-black leading-tight text-transparent">

          {isPaid

            ? 'Payment Successful'

            : booking.payment_status ===
              'paid_partial'

            ? 'Advance Payment Submitted'

            : 'Payment Submitted'}

        </h1>

        {/* DESCRIPTION */}

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#5b6470]">

          {isPaid

            ? `Your booking for ${booking.event_title} has been successfully confirmed with full payment.`

            : booking.payment_status ===
              'paid_partial'

            ? `Advance payment uploaded successfully. Remaining amount can be paid later after admin approval.`

            : `Payment proof uploaded successfully. Admin will verify your booking shortly.`}

        </p>

        {/* SUCCESS CARDS */}

        <div className="mt-10 grid gap-9 sm:grid-cols-3 space-between">

          <div className="rounded-3xl bg-gradient-to-br from-green-50 to-emerald-100 p-6 shadow-sm">

            <p className="text-xs uppercase tracking-widest text-green-700">
              Payment
            </p>

            <h3 className="mt-3 text-2xl font-black text-green-800">
              Successful
            </h3>

          </div>

          <div className="rounded-3xl bg-gradient-to-br from-[#eefbf3] to-[#dcfce7] p-6 shadow-sm">

            <p className="text-xs uppercase tracking-widest text-green-700">
              Status
            </p>

            <h3 className="mt-3 text-2xl font-black text-green-800">

              {booking.display_status ||
                'Verified'}

            </h3>

          </div>

        </div>

        {/* SUMMARY */}

        <div className="mt-10 rounded-[2.5rem] border border-[#ece3d8] bg-[#faf7f2]/90 p-8 text-left shadow-inner">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs uppercase tracking-[0.3em] text-[#8b5e34]">
                Booking Summary
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#1f2937]">
                Order Details
              </h2>

            </div>

            <div className="rounded-2xl bg-white px-5 py-3 shadow-sm">

              <p className="text-xs uppercase tracking-widest text-[#8b5e34]">
                Booking ID
              </p>

              <h3 className="mt-1 text-lg font-black text-[#1f2937]">
                #{booking.id}
              </h3>

            </div>

          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <p className="text-xs uppercase tracking-widest text-[#8b5e34]">
                Event
              </p>

              <h3 className="mt-2 text-xl font-black text-[#1f2937]">
                {booking.event_title}
              </h3>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <p className="text-xs uppercase tracking-widest text-[#8b5e34]">
                Payment Type
              </p>

              <h3 className="mt-2 text-xl font-black capitalize text-[#1f2937]">
                {booking.payment_type}
              </h3>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <p className="text-xs uppercase tracking-widest text-[#8b5e34]">
                Amount Paid
              </p>

              <h3 className="mt-2 text-2xl font-black text-green-700">

                ₹
                {booking.amount_paid?.toLocaleString()}

              </h3>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <p className="text-xs uppercase tracking-widest text-[#8b5e34]">
                Remaining
              </p>

              <h3 className="mt-2 text-2xl font-black text-red-600">

                ₹
                {booking.remaining_amount?.toLocaleString()}

              </h3>

            </div>

          </div>

        </div>

        {/* STATUS */}

        <div className="mt-10">

          <span
            className={`inline-flex rounded-full px-8 py-4 text-sm font-bold shadow-lg ${
              booking.payment_status ===
              'paid_full'

                ? 'bg-green-100 text-green-800'

                : booking.payment_status ===
                  'paid_partial'

                ? 'bg-blue-100 text-blue-800'

                : 'bg-amber-100 text-amber-800'
            }`}
          >

            {booking.display_status ||
              'Pending'}

          </span>

        </div>

        {/* BUTTONS */}

        <div className="mt-12 flex flex-wrap justify-center gap-4">

          {booking.remaining_amount > 0 &&
            booking.status === 'Approved' &&
            booking.payment_status === 'paid_partial' && (

            <button
              type="button"
              onClick={() => {

                setSubmitted(false)

                setPaymentType('full')

                setPaymentPhoto(null)

                setPreview('')
              }}
              className="rounded-full bg-gradient-to-r from-[#8b5e34] to-[#d2a679] px-10 py-5 text-sm font-bold text-white shadow-xl transition hover:scale-105"
            >

              Pay Remaining ₹
              {booking.remaining_amount?.toLocaleString()}

            </button>
          )}

          {user ? (

            <Link
              to="/dashboard"
              className="rounded-full border border-[#d9c9b8] bg-white px-10 py-5 text-sm font-bold text-[#8b5e34] shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              Go to Dashboard
            </Link>

          ) : (

            <Link
              to="/login"
              state={{
                from: '/dashboard',
              }}
              className="rounded-full border border-[#d9c9b8] bg-white px-10 py-5 text-sm font-bold text-[#8b5e34] shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              Login to View Dashboard
            </Link>

          )}

        </div>

      </article>

    </section>
  )
}
  return (
    <section className="perspective-scene min-h-screen py-16">
      <section className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <p className="inline-flex rounded-full border border-[#d6c3af] bg-white/80 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8b5e34]">
          Secure Checkout
        </p>

        <h1 className="mt-6 text-5xl font-bold text-[#1f2937]">
          {alreadyPaid ? 'Pay Remaining Balance' : 'Payment Gateway'}
        </h1>

        <p className="mt-3 text-lg text-[#5b6470]">
          {booking.event_title}
          {alreadyPaid && (
            <span className="mt-1 block text-base text-[#8b5e34]">
              Remaining due: ₹{remainingAmount.toLocaleString()}
            </span>
          )}
        </p>

        <form
          onSubmit={handlePay}
          className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]"
        >
          {/* LEFT */}

          <section className="glass-panel-3d p-8">
            {/* PAYMENT TYPE */}

            <h2 className="text-2xl font-bold text-[#1f2937]">
              Payment Option
            </h2>

            <div className="mt-5 flex flex-wrap gap-4">

  {!alreadyPaid && (
    <button
      type="button"
      onClick={() =>
        setPaymentType(
          'advance'
        )
      }
      className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
        paymentType ===
        'advance'
          ? 'bg-[#8b5e34] text-white'
          : 'bg-[#f4e8dc] text-[#8b5e34]'
      }`}
    >
      Advance Payment
    </button>
  )}

  <button
    type="button"
    onClick={() =>
      setPaymentType('full')
    }
    className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
      paymentType === 'full'
        ? 'bg-[#8b5e34] text-white'
        : 'bg-[#f4e8dc] text-[#8b5e34]'
    }`}
  >
    {alreadyPaid
      ? 'Pay Remaining Amount'
      : 'Full Payment'}
  </button>

</div>

            {/* METHODS */}

            <h2 className="mt-10 text-2xl font-bold text-[#1f2937]">
              Payment Method
            </h2>

            <fieldset className="mt-5 grid gap-4 sm:grid-cols-2">
              {methods.map((m) => (
                <label
                  key={m.id}
                  className="flex cursor-pointer items-center gap-4 rounded-[1.5rem] border-2 border-[#ece3d9] p-5 transition has-[:checked]:border-[#8b5e34] has-[:checked]:bg-[#faf7f2]"
                >
                  <input
                    type="radio"
                    name="method"
                    value={m.id}
                    checked={
                      paymentMethod ===
                      m.id
                    }
                    onChange={() =>
                      setPaymentMethod(
                        m.id
                      )
                    }
                    className="accent-[#8b5e34]"
                  />

                  <span className="text-2xl">
                    {m.icon}
                  </span>

                  <span className="text-sm font-semibold">
                    {m.label}
                  </span>
                </label>
              ))}
            </fieldset>

            {/* DEMO */}

            <div className="mt-10 rounded-[2rem] bg-[#f8f5f0] p-6">
              <h3 className="text-xl font-bold text-[#1f2937]">
                Demo Payment Details
              </h3>

              <div className="mt-5 space-y-3 text-sm text-[#5b6470]">
                <p>
                  <span className="font-semibold">
                    UPI:
                  </span>{' '}
                  eventease@upi
                </p>

                <p>
                  <span className="font-semibold">
                    Account:
                  </span>{' '}
                  458965214785
                </p>

                <p>
                  <span className="font-semibold">
                    IFSC:
                  </span>{' '}
                  EVNT0001458
                </p>

                <p>
                  <span className="font-semibold">
                    Bank:
                  </span>{' '}
                  EventEase Bank
                </p>
              </div>
            </div>

            {/* FILE */}

            <div className="mt-10">
              <h2 className="text-xl font-bold text-[#1f2937]">
                Upload Payment Photo
                <span className="text-red-600">
                  {' '}
                  *
                </span>
              </h2>

              <p className="mt-2 text-sm text-[#5b6470]">
                Upload UPI screenshot,
                bank receipt, or
                transaction photo.
              </p>

              <input
                type="file"
                accept="image/*"
                required
                onChange={
                  handlePhotoChange
                }
                className="input-3d mt-5 file:mr-4 file:rounded-full file:border-0 file:bg-[#8b5e34] file:px-5 file:py-2 file:text-white"
              />

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="mt-5 h-56 rounded-[2rem] object-cover shadow-lg"
                />
              )}
            </div>

            {payError && (
              <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">
                {payError}
              </div>
            )}
          </section>

          {/* RIGHT */}

          <aside className="glass-panel-3d h-fit p-8 lg:sticky lg:top-8">
            <h2 className="text-2xl font-bold text-[#1f2937]">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm text-[#5b6470]">
              <div className="flex justify-between">
                <span>
                  Event Date
                </span>

                <span>
                  {
                    booking.booking_date
                  }
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  Payment Type
                </span>

                <span className="capitalize">
                  {paymentType}
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  Total Amount
                </span>

                <span>
                  ₹
                  {booking.total_amount.toLocaleString()}
                </span>
              </div>

              {paymentType ===
                'advance' && (
                <div className="flex justify-between">
                  <span>
                    Remaining
                  </span>

                  <span className="text-red-500">
                    ₹
                    {remainingAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <hr className="border-[#ece3d9]" />

              <div className="flex justify-between text-2xl font-bold text-[#1f2937]">
                <span>Pay Now</span>

                <span className="text-[#8b5e34]">
                  ₹
                  {payableAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                paying ||
                !paymentPhoto
              }
              className="btn-3d mt-8 w-full rounded-full bg-[#8b5e34] py-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              {paying
                ? 'Uploading...'
                : alreadyPaid
                  ? `Pay Remaining ₹${payableAmount.toLocaleString()}`
                  : 'Submit Payment & Book'}
            </button>
          </aside>
        </form>
      </section>
    </section>
  )
}