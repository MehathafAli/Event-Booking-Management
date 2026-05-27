import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  normalizePhone,
  validatePhoneField,
} from '../utils/validation'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setFieldErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  // UPDATED HANDLE SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault()

    setError('')

    const errors = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required.'
    }

    const phoneErr = validatePhoneField(formData.phone)

    if (phoneErr) {
      errors.phone = phoneErr
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required.'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})

    // DUMMY SUCCESS
    setSubmitted(true)

    setFormData({
      name: '',
      phone: '',
      message: '',
    })

    // OPTIONAL REDIRECT
    setTimeout(() => {
      navigate('/')
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0] py-20">
      {/* HERO SECTION */}

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

            {/* SUCCESS MESSAGE */}

            {submitted && (
              <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">
                <p className="font-medium text-green-700">
                  Message sent successfully!
                </p>
              </div>
            )}

            {/* ERROR MESSAGE */}

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

                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.name}
                  </p>
                )}
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
                  inputMode="numeric"
                  pattern="[6-9][0-9]{9}"
                  maxLength={14}
                  placeholder="9876543210"
                  className="input-3d mt-3"
                />

                {fieldErrors.phone && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.phone}
                  </p>
                )}
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

                {fieldErrors.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.message}
                  </p>
                )}
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

          {/* RIGHT SECTION */}

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
                        Hyderabad, Telangana, India
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