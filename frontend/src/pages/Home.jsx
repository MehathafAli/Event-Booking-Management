import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'
import sampleEvents from '../data/events'
import { getEventCoverImage } from '../utils/images'

const services = [
  {
    title: 'Luxury Decoration',
    price: '₹5,000+',
    image:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    desc: 'Elegant floral themes, premium stage decoration, and stylish lighting setups.',
  },
  {
    title: 'Premium Catering',
    price: '₹12,000+',
    image:
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    desc: 'Veg and non-veg food packages with desserts, live counters, and beverages.',
  },
  {
    title: 'Photography',
    price: '₹7,000+',
    image:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    desc: 'Cinematic photography, candid moments, drone coverage, and premium albums.',
  },
  {
    title: 'DJ & Entertainment',
    price: '₹4,500+',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
    desc: 'Professional DJ, dance floor lighting, live music, and entertainment shows.',
  },
]

const reviews = [
  {
    name: 'Rahul Sharma',
    role: 'Wedding Client',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    review:
      'Everything was managed professionally. Decoration and catering were excellent.',
  },
  {
    name: 'Priya Reddy',
    role: 'Birthday Event',
    image:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=300&q=80',
    review:
      'Beautiful event setup and smooth organization. Guests loved the food and music.',
  },
  {
    name: 'Arjun Kumar',
    role: 'Corporate Event',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    review:
      'Very professional service with clean arrangements and modern presentation.',
  },
]

const stats = [
  { title: 'Events', value: '1200+' },
  { title: 'Clients', value: '950+' },
  { title: 'Vendors', value: '150+' },
  { title: 'Cities', value: '25+' },
]

const HERO_VIDEO =
  'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-holding-hands-4648-large.mp4'

export default function Home() {
  const [events, setEvents] = useState(sampleEvents)

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await API.get('events/')
        if (Array.isArray(response.data) && response.data.length > 0) {
          setEvents(response.data)
        }
      } catch {
        setEvents(sampleEvents)
      }
    }
    loadEvents()
  }, [])

  return (
    <div className="perspective-scene overflow-hidden">
      {/* HERO */}
      <section className="section-3d relative overflow-hidden bg-gradient-to-br from-[#f4e8dc] via-[#f8f5f0] to-[#efe3d5] py-16">
        <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-[#d6bfa9]/30 blur-[120px]" />
        <div className="absolute bottom-[-120px] right-[-120px] h-[300px] w-[300px] rounded-full bg-[#e8d7c3]/40 blur-[120px]" />

        <div className="mx-auto grid max-w-[1500px] items-center gap-16 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
          <div className="reveal-3d">
            <div className="glass-panel-3d inline-flex items-center px-5 py-2 text-sm font-semibold tracking-wide text-[#7c5c3b]">
              Premium Event Management
            </div>

            <h1 className="section-title-3d mt-8 text-5xl leading-tight sm:text-6xl lg:text-7xl">
              Create Elegant
              <span className="block text-[#8b5e34]">Event Experiences</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-9 text-[#5b6470] sm:text-xl">
              Weddings, birthdays, engagements, corporate events, luxury catering,
              photography, DJ, decorations, and complete premium event solutions.
            </p>

            <div className="mt-12 flex flex-wrap gap-5">
              <Link
                to="/events"
                className="btn-3d rounded-full bg-[#8b5e34] px-8 py-4 text-lg text-white hover:bg-[#714a28]"
              >
                Explore Events
              </Link>
              <Link
                to="/contact"
                className="btn-3d btn-3d-outline rounded-full border border-[#d2c0ac] bg-white px-8 py-4 text-lg text-[#6b4b2c]"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item, i) => (
                <div
                  key={item.title}
                  className={`card-3d glass-panel-3d p-6 reveal-3d reveal-delay-${i + 1}`}
                >
                  <h3 className="text-4xl font-bold text-[#8b5e34]">{item.value}</h3>
                  <p className="mt-3 font-medium text-[#5b6470]">{item.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-3d reveal-delay-2">
            <div className="hero-video-wrap h-[520px] sm:h-[620px]">
              <video
                autoPlay
                muted
                loop
                playsInline
                poster="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80"
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src={HERO_VIDEO} type="video/mp4" />
              </video>
              <div className="hero-video-overlay" />
              <div className="absolute bottom-8 left-8 right-8 glass-panel-3d p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8b5e34]">
                  3D Event Preview
                </p>
                <h3 className="mt-2 text-2xl font-bold text-white drop-shadow-lg">
                  Luxury Celebrations
                </h3>
                <p className="mt-2 text-sm text-white/90">
                  Immersive planning with video showcases and premium packages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATIC SERVICES */}
      <section className="section-3d py-28">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <div className="text-center reveal-3d">
            <p className="text-sm font-semibold uppercase tracking-[0.5em] text-[#8b5e34]">
              SERVICES
            </p>
            <h2 className="section-title-3d mt-6">
              Everything Needed
              <span className="block text-[#8b5e34]">For Perfect Events</span>
            </h2>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service, i) => (
              <article
                key={service.title}
                className={`card-3d card-3d-shine overflow-hidden rounded-[2.5rem] bg-white shadow-lg reveal-3d reveal-delay-${(i % 4) + 1}`}
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-7">
                  <span className="inline-flex rounded-full bg-[#f4e8dc] px-4 py-2 text-sm font-semibold text-[#8b5e34]">
                    {service.price}
                  </span>
                  <h3 className="mt-5 text-2xl font-bold">{service.title}</h3>
                  <p className="mt-4 leading-8 text-[#5b6470]">{service.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section-3d bg-white/80 py-28 backdrop-blur-sm">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="reveal-3d">
              <p className="text-sm font-semibold uppercase tracking-[0.5em] text-[#8b5e34]">
                FEATURED
              </p>
              <h2 className="section-title-3d mt-6">
                Popular
                <span className="block text-[#8b5e34]">Event Picks</span>
              </h2>
            </div>
            <Link
              to="/events"
              className="btn-3d rounded-full bg-[#8b5e34] px-8 py-4 text-lg text-white"
            >
              View All
            </Link>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {events.slice(0, 3).map((event, i) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className={`event-tile-3d reveal-3d reveal-delay-${i + 1}`}
              >
                <div className="event-tile-media">
                  <img
                    src={getEventCoverImage(event)}
                    alt={event.title}
                    onError={(e) => {
                      e.currentTarget.src = getEventCoverImage({})
                    }}
                  />
                </div>
                <div className="p-6">
                  <span className="rounded-full bg-[#f4e8dc] px-3 py-1 text-xs font-semibold text-[#8b5e34]">
                    {event.category}
                  </span>
                  <h3 className="mt-4 text-2xl font-bold">{event.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[#5b6470]">
                    {event.excerpt || event.description}
                  </p>
                  <p className="mt-4 font-semibold text-[#8b5e34]">Open Event →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section-3d py-28">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <h2 className="section-title-3d text-center reveal-3d">
            What Clients <span className="text-[#8b5e34]">Say About Us</span>
          </h2>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {reviews.map((review, i) => (
              <article
                key={review.name}
                className={`card-3d glass-panel-3d p-8 reveal-3d reveal-delay-${i + 1}`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="h-14 w-14 rounded-full object-cover ring-4 ring-[#f4e8dc]"
                  />
                  <div>
                    <h3 className="font-bold">{review.name}</h3>
                    <p className="text-sm text-[#5b6470]">{review.role}</p>
                  </div>
                </div>
                <p className="mt-6 leading-8 text-[#5b6470]">"{review.review}"</p>
                <p className="mt-4 text-[#d4a017]">★★★★★</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ALL EVENTS — click to open (at bottom) */}
      <section
        id="all-events"
        className="section-3d relative overflow-hidden bg-gradient-to-b from-[#efe3d5] to-[#f8f5f0] py-28"
      >
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <div className="text-center reveal-3d">
            <p className="text-sm font-semibold uppercase tracking-[0.5em] text-[#8b5e34]">
              OUR EVENT SERVICES
            </p>
            <h2 className="section-title-3d mt-6">
              Choose Your
              <span className="block text-[#8b5e34]">Event Package</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#5b6470]">
              Tap any event below to open full details, customize your package, and book online.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {events.map((event, i) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className={`event-tile-3d group reveal-3d`}
                style={{ animationDelay: `${(i % 8) * 0.06}s` }}
              >
                <div className="event-tile-media">
                  <img
                    src={getEventCoverImage(event)}
                    alt={event.title}
                    onError={(e) => {
                      e.currentTarget.src = getEventCoverImage({})
                    }}
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                    <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-[#8b5e34]">
                      Click to explore →
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8b5e34]">
                    {event.category}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-[#1f2937] group-hover:text-[#8b5e34]">
                    {event.title}
                  </h3>
                  {event.location && (
                    <p className="mt-1 text-xs text-[#8b5e34]">📍 {event.location}</p>
                  )}
                  <p className="mt-2 line-clamp-2 text-sm text-[#5b6470]">
                    {event.excerpt || event.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-3d bg-[#8b5e34] py-24 text-white">
        <div className="mx-auto max-w-5xl px-5 text-center reveal-3d">
          <h2 className="text-4xl font-bold sm:text-5xl">
            Ready To Plan Your Dream Event?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
            Contact our team or browse events to start building your package today.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <Link
              to="/contact"
              className="btn-3d rounded-full bg-white px-10 py-4 text-lg font-semibold text-[#8b5e34]"
            >
              Contact Us
            </Link>
            <Link
              to="/events"
              className="btn-3d btn-3d-outline rounded-full border border-white/40 px-10 py-4 text-lg text-white"
            >
              All Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
