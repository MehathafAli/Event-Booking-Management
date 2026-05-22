import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  setError('')

  try {
    const response = await fetch(
      'http://localhost:8000/api/contact/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.log(data)
      throw new Error('Failed')
    }

    setSubmitted(true)

    setFormData({
      name: '',
      phone: '',
      message: '',
    })

    setTimeout(() => {
      navigate('/')
    }, 3000)
  } catch (err) {
    setError(
      'Failed to send your message. Please try again.'
    )

    console.error(err)
  }
}

  /* SUCCESS SCREEN */

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5f0] px-5">
        <div className="w-full max-w-xl rounded-[2.5rem] bg-white p-10 text-center shadow-xl">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#8b5e34] text-white shadow-lg">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="mt-8 text-4xl font-bold text-[#1f2937]">
            Thank You!
          </h2>

          <p className="mt-5 text-lg leading-8 text-[#5b6470]">
            Your message has been successfully sent.
            Our team will contact you shortly.
          </p>

          <p className="mt-4 text-sm font-medium text-[#8b5e34]">
            Redirecting to home page...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0] py-20">
      {/* HERO */}

      <section>
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <div className="overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#f4e8dc] via-[#f8f5f0] to-[#efe3d5] px-8 py-16 shadow-lg sm:px-12 lg:px-16">
            <div className="max-w-4xl">
              <div className="inline-flex rounded-full border border-[#d6c3af] bg-white/80 px-5 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#8b5e34] shadow-sm">
                CONTACT US
              </div>

              <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight text-[#1f2937] sm:text-6xl">
                Let's Plan Your
                <span className="block text-[#8b5e34]">
                  Perfect Event
                </span>
              </h1>

              <p className="mt-8 max-w-3xl text-lg leading-9 text-[#5b6470] sm:text-xl">
                Have questions about your upcoming event?
                Contact our professional team for catering,
                decoration, photography, DJ, and complete
                event management services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}

      <section className="mt-20">
        <div className="mx-auto grid max-w-[1500px] gap-10 px-5 sm:px-8 lg:grid-cols-[1.2fr,0.8fr] lg:px-12">
          {/* LEFT FORM */}

          <div className="rounded-[3rem] bg-white p-8 shadow-lg sm:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#8b5e34]">
                SEND MESSAGE
              </p>

              <h2 className="mt-5 text-4xl font-bold tracking-tight text-[#1f2937]">
                Get In Touch
              </h2>

              <p className="mt-5 text-lg leading-8 text-[#5b6470]">
                Fill out the form below and our team will
                contact you as soon as possible.
              </p>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
                <p className="font-medium text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-7"
            >
              {/* NAME */}

              <div>
                <label className="text-sm font-semibold uppercase tracking-wide text-[#1f2937]">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="input-3d mt-3"
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="text-sm font-semibold uppercase tracking-wide text-[#1f2937]">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="input-3d mt-3"
                />
              </div>

              {/* MESSAGE */}

              <div>
                <label className="text-sm font-semibold uppercase tracking-wide text-[#1f2937]">
                  Message
                </label>

                <textarea
                  name="message"
                  required
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your event..."
                  className="textarea-3d mt-3 resize-none"
                />
              </div>

              {/* BUTTON */}

              <button
                type="submit"
                className="btn-3d w-full rounded-full bg-[#8b5e34] px-8 py-4 text-lg text-white"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* RIGHT INFO */}

          <div className="space-y-8">
            {/* CONTACT CARD */}

            <div className="rounded-[3rem] bg-white p-8 shadow-lg sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#8b5e34]">
                CONTACT INFO
              </p>

              <h2 className="mt-5 text-4xl font-bold tracking-tight text-[#1f2937]">
                Reach Us
              </h2>

              <div className="mt-10 space-y-6">
                {/* EMAIL */}

                <div className="rounded-[2rem] bg-[#f8f5f0] p-6">
                  <div className="flex items-start gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8b5e34] text-white">
                      ✉
                    </div>

                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-[#8b5e34]">
                        Email
                      </p>

                      <p className="mt-2 text-lg font-medium text-[#1f2937]">
                        info@eventease.com
                      </p>
                    </div>
                  </div>
                </div>

                {/* PHONE */}

                <div className="rounded-[2rem] bg-[#f8f5f0] p-6">
                  <div className="flex items-start gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8b5e34] text-white">
                      ☎
                    </div>

                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-[#8b5e34]">
                        Phone
                      </p>

                      <p className="mt-2 text-lg font-medium text-[#1f2937]">
                        +91 98765 43210
                      </p>
                    </div>
                  </div>
                </div>

                {/* LOCATION */}

                <div className="rounded-[2rem] bg-[#f8f5f0] p-6">
                  <div className="flex items-start gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8b5e34] text-white">
                      📍
                    </div>

                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-[#8b5e34]">
                        Office
                      </p>

                      <p className="mt-2 text-lg font-medium leading-8 text-[#1f2937]">
                        Hyderabad, Telangana,
                        India
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SUPPORT CARD */}

            <div className="rounded-[3rem] bg-[#8b5e34] p-8 text-white shadow-lg sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#f3e5d3]">
                EVENT SUPPORT
              </p>

              <h2 className="mt-5 text-4xl font-bold tracking-tight">
                Professional Planning
              </h2>

              <p className="mt-6 text-lg leading-9 text-white/90">
                Our experienced team helps with weddings,
                birthday parties, engagements, corporate
                events, catering, and complete event setups.
              </p>

              <div className="mt-10 rounded-[2rem] bg-white/10 p-6 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.3em] text-[#f3e5d3]">
                  Available
                </p>

                <p className="mt-3 text-2xl font-bold">
                  Monday - Sunday
                </p>

                <p className="mt-2 text-white/80">
                  9:00 AM - 10:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}













/*import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:8000/api/events/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit contact form')
      }

      setSubmitted(true)
      setFormData({ name: '', phone: '', message: '' })

      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (err) {
      setError('Failed to send your message. Please try again.')
      console.error(err)
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-6 p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-lg">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30">
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-green-700">Thank You!</h2>
          <p className="text-lg text-green-600">
            Our team will contact you soon...
          </p>
          <p className="text-sm text-green-500">
            Redirecting to home in a few seconds...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-sky-700 to-cyan-600 px-6 py-16 text-white shadow-2xl shadow-slate-900/20">
        <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute left-0 bottom-0 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="mx-auto max-w-3xl relative z-10">
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Get In Touch
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-100/90">
            Have questions or need help with your event? We'd love to hear from you! Fill out the form below and our team will get back to you shortly.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-2xl">
        <div className="rounded-[2rem] bg-white p-8 shadow-lg ring-1 ring-slate-200">
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-200">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-900">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-900">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-slate-900">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell us about your event needs..."
                rows="6"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 resize-none"
              />
            </div>

            
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:shadow-xl hover:shadow-sky-500/40 hover:scale-105 transform"
            >
              Send Message
            </button>
          </form>

          
          <div className="mt-10 border-t border-slate-200 pt-10">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Other Ways to Reach Us</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 p-6 border border-purple-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500 text-white mb-3">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="font-semibold text-slate-900">info@eventease.com</p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-6 border border-blue-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white mb-3">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-600">Phone</p>
                <p className="font-semibold text-slate-900">+91 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
*/