import { Link } from 'react-router-dom'
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
  {
    title: 'Events',
    value: '1200+',
  },

  {
    title: 'Clients',
    value: '950+',
  },

  {
    title: 'Vendors',
    value: '150+',
  },

  {
    title: 'Cities',
    value: '25+',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f8f5f0] text-[#1f2937]">
      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#f4e8dc] via-[#f8f5f0] to-[#efe3d5]">
        {/* glow */}

        <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-[#d6bfa9]/30 blur-[120px]" />

        <div className="absolute right-[-120px] bottom-[-120px] h-[300px] w-[300px] rounded-full bg-[#e8d7c3]/40 blur-[120px]" />

        <div className="mx-auto grid min-h-screen max-w-[1500px] items-center gap-16 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-12">
          {/* LEFT */}

          <div>
            <div className="inline-flex items-center rounded-full border border-[#d6c3af] bg-white/70 px-5 py-2 text-sm font-semibold tracking-wide text-[#7c5c3b] shadow-sm backdrop-blur-xl">
              Premium Event Management
            </div>

            <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Create Elegant
              <span className="block text-[#8b5e34]">
                Event Experiences
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-9 text-[#5b6470] sm:text-xl">
              Weddings, birthdays, engagements, corporate events,
              luxury catering, photography, DJ, decorations,
              and complete premium event solutions.
            </p>

            {/* buttons */}

            <div className="mt-12 flex flex-wrap gap-5">
              <Link
                to="/events"
                className="rounded-full bg-[#8b5e34] px-8 py-4 text-lg font-semibold text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-[#714a28]"
              >
                Explore Events
              </Link>

              <Link
                to="/contact"
                className="rounded-full border border-[#d2c0ac] bg-white px-8 py-4 text-lg font-semibold text-[#6b4b2c] shadow-sm transition duration-300 hover:scale-105"
              >
                Contact Us
              </Link>
            </div>

            {/* stats */}

            <div className="mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[2rem] bg-white p-6 shadow-md transition duration-300 hover:-translate-y-2"
                >
                  <h3 className="text-4xl font-bold text-[#8b5e34]">
                    {item.value}
                  </h3>

                  <p className="mt-3 text-base font-medium text-[#5b6470]">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE */}

          <div className="relative">
            <div className="absolute inset-0 rounded-[3rem] bg-[#d9c7b4]/30 blur-3xl" />

            <div className="relative overflow-hidden rounded-[3rem] bg-white p-5 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80"
                alt="event"
                className="h-[650px] w-full rounded-[2.5rem] object-cover"
              />

              <div className="absolute bottom-10 left-10 rounded-[2rem] bg-white/90 p-6 shadow-xl backdrop-blur-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8b5e34]">
                  Elegant Events
                </p>

                <h3 className="mt-3 text-3xl font-bold text-[#1f2937]">
                  Luxury Celebrations
                </h3>

                <p className="mt-3 max-w-sm text-base leading-7 text-[#5b6470]">
                  Professional event planning with catering,
                  decoration, music, and photography services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}

      <section className="py-28">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.5em] text-[#8b5e34]">
              SERVICES
            </p>

            <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Everything Needed
              <span className="block text-[#8b5e34]">
                For Perfect Events
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-[#5b6470]">
              Discover elegant decoration, premium catering,
              entertainment, photography, and complete event services.
            </p>
          </div>

          {/* cards */}

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="overflow-hidden rounded-[2.5rem] bg-white shadow-lg transition duration-300 hover:-translate-y-3"
              >
                <div className="h-72 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-7">
                  <div className="inline-flex rounded-full bg-[#f4e8dc] px-4 py-2 text-sm font-semibold text-[#8b5e34]">
                    {service.price}
                  </div>

                  <h3 className="mt-5 text-2xl font-bold">
                    {service.title}
                  </h3>

                  <p className="mt-4 text-base leading-8 text-[#5b6470]">
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED EVENTS */}

      <section className="bg-white py-28">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.5em] text-[#8b5e34]">
                FEATURED EVENTS
              </p>

              <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Popular Event
                <span className="block text-[#8b5e34]">
                  Categories
                </span>
              </h2>
            </div>

            <Link
              to="/events"
              className="rounded-full bg-[#8b5e34] px-8 py-4 text-lg font-semibold text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-[#714a28]"
            >
              Browse Events
            </Link>
          </div>

          {/* cards */}

          <div className="mt-20 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {sampleEvents.slice(0, 3).map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="overflow-hidden rounded-[2.5rem] bg-[#f8f5f0] shadow-lg transition duration-300 hover:-translate-y-3"
              >
                <div className="h-80 overflow-hidden">
                  <img
                    src={getEventCoverImage(event)}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = getEventCoverImage({})
                    }}
                  />
                </div>

                <div className="p-7">
                  <div className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#8b5e34] shadow-sm">
                    {event.category}
                  </div>

                  <h3 className="mt-5 text-3xl font-bold">
                    {event.title}
                  </h3>

                  <p className="mt-4 text-base leading-8 text-[#5b6470]">
                    {event.excerpt}
                  </p>

                  <div className="mt-6 font-semibold text-[#8b5e34]">
                    View Details →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}

      <section className="py-28">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.5em] text-[#8b5e34]">
              REVIEWS
            </p>

            <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              What Clients
              <span className="block text-[#8b5e34]">
                Say About Us
              </span>
            </h2>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => (
              <div
                key={review.name}
                className="rounded-[2.5rem] bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-3"
              >
                <div className="flex items-center gap-5">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="text-xl font-bold">
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
      </section>

      {/* CTA */}

      <section className="bg-[#8b5e34] py-28 text-white">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <div className="inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-semibold tracking-wide backdrop-blur-xl">
            PREMIUM EVENT MANAGEMENT
          </div>

          <h2 className="mt-8 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Ready To Plan
            <span className="block text-[#f3e5d3]">
              Your Dream Event?
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-white/90">
            Contact our professional event team and create
            memorable celebrations with luxury experiences.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <Link
              to="/contact"
              className="rounded-full bg-white px-10 py-5 text-lg font-semibold text-[#8b5e34] shadow-lg transition duration-300 hover:scale-105"
            >
              Contact Us
            </Link>

            <Link
              to="/events"
              className="rounded-full border border-white/30 px-10 py-5 text-lg font-semibold text-white transition duration-300 hover:scale-105"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}



/*import { Link } from 'react-router-dom'
import sampleEvents from '../data/events'

const services = [
  {
    title: 'Decoration',
    price: '₹5000',
    description:
      'Luxury floral arrangements, stage lighting, theme decor, and elegant setups.',
    image:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80',
    color: 'from-indigo-600 via-sky-500 to-cyan-400',
    accent: 'text-cyan-300',
  },
  {
    title: 'Catering',
    price: '₹12000',
    description:
      'Veg and non-veg packages, live counters, desserts, and premium service.',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
    color: 'from-emerald-600 via-teal-500 to-cyan-400',
    accent: 'text-emerald-300',
  },
  {
    title: 'Photography',
    price: '₹7000',
    description:
      'Professional photography and videography for memorable moments.',
    image:
      'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?auto=format&fit=crop&w=400&q=80',
    color: 'from-slate-700 via-indigo-600 to-blue-500',
    accent: 'text-blue-300',
  },
  {
    title: 'DJ & Music',
    price: '₹4500',
    description:
      'Powerful sound, stage lights, and music to keep the crowd energetic.',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80',
    color: 'from-amber-600 via-orange-500 to-red-500',
    accent: 'text-amber-300',
  },
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Bride',
    review:
      'EventEase made our wedding day look premium and elegant. The design and service were excellent!',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&q=80',
  },
  {
    name: 'Michael Chen',
    role: 'Corporate Client',
    review:
      'The layout, decoration, and food package options felt professional and well-organized.',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
  },
  {
    name: 'Emma Davis',
    role: 'Birthday Client',
    review:
      'The colorful but clean design made the whole celebration feel modern and stylish.',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
  },
]

const stats = [
  { label: 'Events Booked', value: '1.2K+', icon: '🎉' },
  { label: 'Happy Clients', value: '950+', icon: '😊' },
  { label: 'Expert Vendors', value: '120+', icon: '⭐' },
]

export default function Home() {
  return (
    <div className="space-y-24 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pb-20 text-white">
      
      <section className="relative overflow-hidden rounded-b-[4rem] bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.22),_transparent_35%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] px-6 py-24 shadow-2xl">
        <div className="absolute left-[-80px] top-[-80px] h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-[-100px] top-16 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-semibold backdrop-blur-xl">
              <span>✨</span>
              Premium Event Planning
            </div>

            <h1 className="mt-8 text-5xl font-black leading-tight sm:text-6xl">
              Build
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                unforgettable
              </span>
              celebrations
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
              Plan weddings, birthdays, corporate events, baby showers, and engagement
              parties with elegant decorations, food packages, photography, DJ, and more.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <Link
                to="/events"
                className="rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-2xl transition duration-300 hover:scale-105 hover:shadow-cyan-500/30"
              >
                Explore Events
              </Link>

              <Link
                to="/contact"
                className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-lg font-bold text-white backdrop-blur-xl transition duration-300 hover:scale-105 hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/10"
                >
                  <p className="text-4xl">{item.icon}</p>
                  <h3 className="mt-4 text-3xl font-black">{item.value}</h3>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[3rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                    Featured Services
                  </p>
                  <h2 className="mt-3 text-3xl font-black">
                    Modern, clean, and elegant
                  </h2>
                </div>
                <div className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">
                  Trending
                </div>
              </div>

              <div className="mt-8 grid gap-4">
                {services.map((item, index) => (
                  <div
                    key={item.title}
                    className={`rounded-[1.75rem] border border-white/10 p-5 transition duration-300 ${
                      index % 2 === 0
                        ? 'bg-slate-900/70 hover:bg-slate-900/90'
                        : 'bg-slate-800/70 hover:bg-slate-800/90'
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                    <p className="mt-4 inline-flex rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-200">
                      Starts at {item.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-bold uppercase tracking-[0.4em] text-cyan-300">
              Our Services
            </p>
            <h2 className="mt-5 text-5xl font-black leading-tight">
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                Premium event experiences
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Discover classy decorations, food packages, entertainment, photography,
              and all the services needed for a beautiful event.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="group overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/80 shadow-2xl transition duration-500 hover:-translate-y-4 hover:shadow-cyan-500/10"
              >
                <div className={`h-64 overflow-hidden bg-gradient-to-br ${service.color}`}>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-110 group-hover:opacity-100"
                  />
                </div>

                <div className="p-7">
                  <h3 className={`text-2xl font-black ${service.accent}`}>
                    {service.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-300">
                    {service.description}
                  </p>

                  <div
                    className={`mt-6 inline-flex rounded-full bg-gradient-to-r ${service.color} px-5 py-2 text-lg font-bold text-white shadow-lg`}
                  >
                    {service.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="px-6">
        <div className="mx-auto max-w-7xl rounded-[3rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 px-8 py-16 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-bold uppercase tracking-[0.4em] text-emerald-300">
                Featured Events
              </p>
              <h2 className="mt-5 text-5xl font-black leading-tight text-white">
                Events everyone loves
              </h2>
            </div>

            <Link
              to="/events"
              className="rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 px-8 py-4 text-lg font-bold text-slate-950 shadow-2xl transition duration-300 hover:scale-105"
            >
              Browse Events
            </Link>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {sampleEvents.slice(0, 3).map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="group overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900 shadow-2xl transition duration-500 hover:-translate-y-4 hover:border-cyan-400/30"
              >
                <div className="h-72 overflow-hidden">
                  <img
                    src={event.images?.[0] ?? 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="p-7">
                  <p className="font-bold uppercase tracking-[0.3em] text-cyan-300">
                    {event.category}
                  </p>
                  <h3 className="mt-4 text-3xl font-black text-white">
                    {event.title}
                  </h3>
                  <p className="mt-4 leading-7 text-slate-300">{event.excerpt}</p>

                  <div className="mt-7 inline-flex rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-bold text-slate-950 shadow-lg transition duration-300 group-hover:scale-105">
                    View Details
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      
      <section className="px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-bold uppercase tracking-[0.4em] text-amber-300">
              Testimonials
            </p>
            <h2 className="mt-5 text-5xl font-black">
              <span className="bg-gradient-to-r from-amber-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                Happy client stories
              </span>
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition duration-300 hover:-translate-y-3 hover:bg-white/10"
              >
                <div className="flex items-center gap-5">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-cyan-300/50"
                  />

                  <div>
                    <h3 className="text-xl font-black text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-slate-400">{testimonial.role}</p>
                  </div>
                </div>

                <p className="mt-6 text-lg leading-8 text-slate-300">
                  "{testimonial.review}"
                </p>

                <div className="mt-6 flex text-amber-300">★★★★★</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="px-6">
        <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.15),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_35%),linear-gradient(135deg,_#0f172a_0%,_#111827_45%,_#020617_100%)] px-8 py-24 text-center text-white shadow-2xl">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 backdrop-blur-xl">
              <span>💎</span>
              Let's Plan Your Dream Event
            </div>

            <h2 className="mt-8 text-5xl font-black leading-tight">
              Ready to create
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-emerald-300 bg-clip-text text-transparent">
                unforgettable memories?
              </span>
            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-300">
              Contact our team today and make your celebration clean, classy, and memorable.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">
              <Link
                to="/contact"
                className="rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-8 py-4 text-lg font-black text-white shadow-2xl transition duration-300 hover:scale-105"
              >
                Contact Us
              </Link>

              <Link
                to="/events"
                className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-lg font-black text-white backdrop-blur-xl transition duration-300 hover:scale-105 hover:bg-white/10"
              >
                Explore Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}*/