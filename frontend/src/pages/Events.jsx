import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'
import sampleEvents from '../data/events'

export default function Events() {
  const [events, setEvents] = useState(sampleEvents)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await API.get('events/')

        // backend events
        const backendEvents = Array.isArray(
          response.data
        )
          ? response.data
          : []

        // merge local + backend
        const mergedEvents = [
          ...sampleEvents,
          ...backendEvents,
        ]

        setEvents(mergedEvents)
      } catch (error) {
        console.error(error)

        // fallback
        setEvents(sampleEvents)
      }
    }

    fetchEvents()
  }, [])

  return (
    <div className="min-h-screen bg-[#f8f5f0] py-20">
      {/* HERO */}

      <section>
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <div className="rounded-[3rem] bg-gradient-to-br from-[#f4e8dc] via-[#f8f5f0] to-[#efe3d5] px-8 py-16 shadow-lg sm:px-12 lg:px-16">
            <div className="max-w-4xl">
              <div className="inline-flex rounded-full border border-[#d6c3af] bg-white/80 px-5 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#8b5e34] shadow-sm">
                EVENTS COLLECTION
              </div>

              <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight text-[#1f2937] sm:text-6xl">
                Discover Beautiful
                <span className="block text-[#8b5e34]">
                  Event Experiences
                </span>
              </h1>

              <p className="mt-8 max-w-3xl text-lg leading-9 text-[#5b6470] sm:text-xl">
                Browse weddings, birthday parties,
                corporate events, engagement
                ceremonies, catering services,
                photography, decoration, DJ, and
                luxury event packages.
              </p>
            </div>

            {/* STATS */}

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[2rem] bg-white p-6 shadow-md">
                <h3 className="text-4xl font-bold text-[#8b5e34]">
                  {events.length}+
                </h3>

                <p className="mt-2 text-[#5b6470]">
                  Available Events
                </p>
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-md">
                <h3 className="text-4xl font-bold text-[#8b5e34]">
                  150+
                </h3>

                <p className="mt-2 text-[#5b6470]">
                  Premium Vendors
                </p>
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-md">
                <h3 className="text-4xl font-bold text-[#8b5e34]">
                  950+
                </h3>

                <p className="mt-2 text-[#5b6470]">
                  Happy Clients
                </p>
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-md">
                <h3 className="text-4xl font-bold text-[#8b5e34]">
                  25+
                </h3>

                <p className="mt-2 text-[#5b6470]">
                  Cities Covered
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS */}

      <section className="mt-20">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.5em] text-[#8b5e34]">
                OUR EVENTS
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#1f2937] sm:text-5xl">
                Premium Event
                <span className="block text-[#8b5e34]">
                  Categories
                </span>
              </h2>
            </div>

            <div className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#5b6470] shadow-sm">
              Browse all available event packages
            </div>
          </div>

          {/* GRID */}

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="group overflow-hidden rounded-[2.5rem] bg-white shadow-lg transition duration-300 hover:-translate-y-3"
              >
                {/* IMAGE */}

                <div className="relative h-50 overflow-hidden">
                  <img
                    src={
                      event.images?.[0] ||
                      'https://images.unsplash.com/photo-1519167758481-83f19106ae4f?auto=format&fit=crop&w=1200&q=80'
                    }
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                  <div className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#8b5e34] shadow-sm backdrop-blur-xl">
                    {event.category}
                  </div>
                </div>

                {/* CONTENT */}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-bold leading-tight text-[#1f2937]">
                        {event.title}
                      </h2>

                      {event.location && (
                        <p className="mt-3 text-sm font-medium text-[#8b5e34]">
                          📍 {event.location}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-3 text-base leading-8 text-[#5b6470]">
                    {event.description}
                  </p>

                  {/* BOTTOM */}

                  <div className="mt-8 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 font-semibold text-[#8b5e34]">
                      View Details →
                    </div>

                    <div className="rounded-full border border-[#eadfd2] px-4 py-2 text-sm font-medium text-[#5b6470]">
                      Premium Event
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}

      <section className="mt-28">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <div className="rounded-[3rem] bg-white px-8 py-16 shadow-lg sm:px-12">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.5em] text-[#8b5e34]">
                CLIENT REVIEWS
              </p>

              <h2 className="mt-5 text-4xl font-bold tracking-tight text-[#1f2937] sm:text-5xl">
                Trusted By Hundreds
                <span className="block text-[#8b5e34]">
                  Of Happy Clients
                </span>
              </h2>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  name: 'Rahul Sharma',
                  role: 'Wedding Event',
                  review:
                    'Beautiful decoration and professional management.',
                },

                {
                  name: 'Priya Reddy',
                  role: 'Birthday Event',
                  review:
                    'Amazing catering and DJ setup.',
                },

                {
                  name: 'Arjun Kumar',
                  role: 'Corporate Event',
                  review:
                    'Excellent service and coordination.',
                },
              ].map((review) => (
                <div
                  key={review.name}
                  className="rounded-[2rem] bg-[#f8f5f0] p-8 transition duration-300 hover:-translate-y-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#8b5e34] text-lg font-bold text-white">
                      {review.name.charAt(0)}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-[#1f2937]">
                        {review.name}
                      </h3>

                      <p className="text-[#5b6470]">
                        {review.role}
                      </p>
                    </div>
                  </div>

                  <p className="mt-6 text-lg leading-9 text-[#5b6470]">
                    "{review.review}"
                  </p>

                  <div className="mt-6 text-[#d4a017]">
                    ★★★★★
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}





/*import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'
import sampleEvents from '../data/events'

export default function Events() {
  const [events, setEvents] = useState(sampleEvents)
  const placeholderImage = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await API.get('events/')
        setEvents(response.data)
      } catch (error) {
        console.error(error)
        setEvents(sampleEvents)
      }
    }
    fetchEvents()
  }, [])

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Events</h1>
        <p className="text-slate-600">Browse available events and services.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {events.length > 0 ? (
          events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-sky-300"
            >
              <div className="h-56 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                <img
                  src={event.images?.[0] ?? 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'}
                  alt={event.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">{event.category}</p>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Tap to open</span>
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">{event.title}</h2>
                <p className="mt-4 text-slate-600 line-clamp-3">{event.description}</p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="inline-flex rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition group-hover:bg-sky-700">
                    View details
                  </span>
                  {event.price ? (
                    <span className="text-sm font-semibold text-slate-500">₹{event.price}</span>
                  ) : null}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-slate-500">No events found yet.</p>
        )}
      </div>
    </div>
  )
}*/
