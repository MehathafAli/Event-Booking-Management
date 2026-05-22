/*<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        
        <div className="mb-8">
          <div className="inline-flex rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
            {event.category}
          </div>
          <h1 className="mt-4 text-4xl font-bold text-slate-900">{event.title}</h1>
          <p className="mt-3 max-w-3xl text-lg text-slate-600">{event.description}</p>
        </div>

       
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          
          <div>
            
            <div className="mb-8 flex flex-wrap gap-3">
              {sectionNames.map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    activeSection === section
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>

            
            <div className="grid gap-6 sm:grid-cols-2">
              {activeItems.length > 0 ? (
                activeItems.map((item) => (
                  <div
                    key={item.name}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition hover:shadow-lg"
                  >
                    
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={getItemImage(item.name, activeSection)}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        onError={(e) => {
                          e.target.src = placeholderImage
                        }}
                      />
                    </div>

                    
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-900">
                        {item.name}
                      </h3>

                      <p className="mt-2 text-sm text-slate-600">
                        {item.details || 'High quality service for your event'}
                      </p>

                      {activeSection === 'Food' && item.items?.length > 0 && (
                        <div className="mt-3">
                          <button
                            onClick={() => toggleFoodDetails(item.name)}
                            className="text-sm font-semibold text-purple-600 hover:text-purple-700"
                          >
                            {isFoodExpanded(item.name)
                              ? 'Hide menu'
                              : `Read menu (${item.items.length} items)`}
                          </button>

                          {isFoodExpanded(item.name) && (
                            <ul className="mt-3 space-y-3 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                              {item.items.map((menuItem, index) => (
                                <li key={`${item.name}-${index}`}>
                                  <p className="font-semibold text-slate-900">{menuItem.name}</p>
                                  <p>{menuItem.details}</p>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}

                      
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-2xl font-bold text-slate-900">
                          ₹{item.price.toLocaleString()}
                        </span>
                        {item.type === 'perPerson' && (
                          <span className="text-xs text-slate-500">per guest</span>
                        )}
                      </div>

                      
                      <button
                        onClick={() => handleAddToPackage(item)}
                        disabled={isInPackage(item)}
                        className={`mt-5 w-full rounded-2xl py-3 text-sm font-bold transition ${
                          isInPackage(item)
                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg'
                        }`}
                      >
                        {isInPackage(item) ? '✓ Added' : 'Add to Package'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full rounded-3xl border border-slate-200 bg-slate-50 p-12 text-center">
                  <p className="text-slate-500">No items available for {activeSection.toLowerCase()}.</p>
                </div>
              )}
            </div>
          </div>

          <div className="sticky top-6 h-fit">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  🎁 Your Package
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {packageItems.length === 0
                    ? 'Start adding items to your package'
                    : `${packageItems.length} item${packageItems.length !== 1 ? 's' : ''} selected`}
                </p>
              </div>

              
              <div className="mb-6 max-h-64 overflow-y-auto space-y-4">
                {packageItems.length > 0 ? (
                  packageItems.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {formatPrice(item)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.name)}
                          className="text-xl text-red-500 hover:text-red-700 font-bold"
                        >
                          ×
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-xs text-slate-600">Qty:</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.name, e.target.value)
                          }
                          className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-sm text-center"
                        />
                      </div>

                      
                      <p className="mt-2 text-right text-sm font-semibold text-slate-900">
                        ₹{itemTotal(item).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                    <p className="text-sm text-slate-500">
                      No items added yet
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-6 space-y-3 border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <label className="text-slate-600">Event Date:</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="text-slate-600">Guest Count:</label>
                  <input
                    type="number"
                    min="1"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value) || 1)}
                    className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-sm text-center"
                  />
                </div>
              </div>

              <div className="mb-6 space-y-3 border-t border-slate-200 pt-4 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Advance (50%)</span>
                  <span>₹{advance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                disabled={packageItems.length === 0}
                className="w-full rounded-2xl bg-purple-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Confirm Package
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>*/



import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../services/api'
import {
  getMinBookingDate,
  SLOT_BOOKED_MESSAGE,
  validateBookingDate,
} from '../utils/bookingDate'
import sampleEvents from '../data/events'
import { getEventCoverImage, getPricingItemImage } from '../utils/images'

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const eventId = Number(id)

  const [event, setEvent] = useState(
    sampleEvents.find((item) => item.id === eventId) ?? null
  )

  const normalizeEvent = (data) => {
    if (data.pricing?.length) {
      return data
    }

    if (data.services?.length) {
      return {
        ...data,
        pricing: data.services.map((service) => ({
          name: service.name,
          price: service.price,
          details: service.description,
          type: 'fixed',
          section: 'Services',
        })),
      }
    }

    return data
  }

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await API.get(`events/${id}/`)
        setEvent(normalizeEvent(response.data))
      } catch (error) {
        console.error(error)
        const fallback = sampleEvents.find((item) => item.id === eventId)
        setEvent(fallback ?? null)
      }
    }

    fetchEvent()
  }, [id, eventId])

  if (!event) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-lg text-slate-500">Loading event details...</p>
      </div>
    )
  }

  // Organize items by section
  const sections = {
    'Function Halls': [],
    Food: [],
    Decorations: [],
    Services: [],
  }

  const getSection = (item) => {
    if (item.section) {
      return item.section
    }

    const name = item.name.toLowerCase()

    if (name.includes('hall') || name.includes('stage') || name.includes('venue')) {
      return 'Function Halls'
    }
    if (name.includes('decor') || name.includes('flower') || name.includes('theme')) {
      return 'Decorations'
    }
    if (name.includes('food') || name.includes('catering') || name.includes('cake') || name.includes('beverage')) {
      return 'Food'
    }
    return 'Services'
  }

  event.pricing?.forEach((item) => {
    const section = getSection(item)
    sections[section].push(item)
  })

  const sectionNames = Object.keys(sections)
  const [activeSection, setActiveSection] = useState(sectionNames[0])
  const [packageItems, setPackageItems] = useState([])
  const [eventDate, setEventDate] = useState('')
  const [dateError, setDateError] = useState('')
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [confirmError, setConfirmError] = useState('')
  const [expandedFood, setExpandedFood] = useState({})

  const toggleFoodDetails = (name) =>
    setExpandedFood((prev) => ({ ...prev, [name]: !prev[name] }))

  const isFoodExpanded = (name) => !!expandedFood[name]

  const activeItems = sections[activeSection] || []

  const isInPackage = (item) =>
    packageItems.some((packageItem) => packageItem.name === item.name)

  const handleAddToPackage = (item) => {
    setPackageItems((prev) => {
      const existing = prev.find((packageItem) => packageItem.name === item.name)
      if (existing) {
        return prev.map((packageItem) =>
          packageItem.name === item.name
            ? { ...packageItem, quantity: packageItem.quantity + 1 }
            : packageItem
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const handleRemoveItem = (name) => {
    setPackageItems((prev) => prev.filter((item) => item.name !== name))
  }

  const handleQuantityChange = (name, value) => {
    const quantity = Math.max(1, Number(value) || 1)
    setPackageItems((prev) =>
      prev.map((item) =>
        item.name === name ? { ...item, quantity } : item
      )
    )
  }

  const formatPrice = (item) =>
    item.type === 'perPerson'
      ? `₹${item.price.toLocaleString()} / person`
      : `₹${item.price.toLocaleString()}`

  const itemTotal = (item) =>
    item.type === 'perPerson'
      ? item.price * item.quantity
      : item.price * item.quantity

  const subtotal = packageItems.reduce(
    (sum, item) => sum + itemTotal(item),
    0
  )
  const advance = Math.round(subtotal * 0.5)
  const totalAmount = subtotal

  const buildPackagePayload = () =>
    packageItems.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      type: item.type || 'fixed',
      section: item.section || getSection(item),
      line_total: itemTotal(item),
    }))

  const minBookingDate = getMinBookingDate()

  const handleConfirmPackage = async () => {
    setDateError('')
    setConfirmError('')

    const dateValidation = validateBookingDate(eventDate)
    if (dateValidation) {
      setDateError(dateValidation)
      return
    }

    if (packageItems.length === 0) {
      return
    }

    setConfirmLoading(true)

    try {
      const response = await API.post('bookings/package/', {
        event: event.id,
        booking_date: eventDate,
        package_items: buildPackagePayload(),
        subtotal: subtotal,
        total_amount: totalAmount,
        location: event.location || '',
      })

      navigate(`/booking-success/${response.data.id}`)
    } catch (err) {
      const data = err.response?.data
      const raw =
        data?.detail ||
        data?.booking_date?.[0] ||
        data?.event?.[0] ||
        data?.package_items?.[0] ||
        (typeof data === 'object' && data !== null
          ? Object.values(data).flat()[0]
          : null)

      let message = raw || 'Failed to save package. Please try again.'
      if (
        typeof raw === 'string' &&
        (raw.toLowerCase().includes('already booked') ||
          raw.toLowerCase().includes('slot'))
      ) {
        const bookedPart = raw.includes('Already booked:')
          ? raw.split('Already booked:')[1]?.trim()
          : ''
        message = bookedPart
          ? `${SLOT_BOOKED_MESSAGE} (${bookedPart})`
          : SLOT_BOOKED_MESSAGE
      }

      if (data?.booking_date?.[0]) {
        setDateError(data.booking_date[0])
      }
      setConfirmError(message)
    } finally {
      setConfirmLoading(false)
    }
  }

  return (
  <div className="perspective-scene min-h-screen py-16">
  <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
    {/* HERO */}

    <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-lg">
      <div className="grid lg:grid-cols-[1fr_420px]">
        <div className="px-8 py-12 sm:px-10 lg:px-14">
          <div className="inline-flex rounded-full border border-[#d6c3af] bg-[#f4e8dc] px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8b5e34]">
            {event.category}
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#1f2937] sm:text-5xl">
            {event.title}
          </h1>

          {event.location && (
            <p className="mt-4 text-sm font-medium text-[#8b5e34]">
              📍 {event.location}
            </p>
          )}

          <p className="mt-6 max-w-3xl text-base leading-8 text-[#5b6470] sm:text-lg">
            {event.description}
          </p>
        </div>

        <div className="relative min-h-[280px] lg:min-h-full">
          <img
            src={getEventCoverImage(event)}
            alt={event.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = getEventCoverImage({})
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent lg:bg-gradient-to-l lg:from-white/30" />
        </div>
      </div>
    </div>

    {/* MAIN SECTION */}

    <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
      {/* LEFT */}

      <div>
        {/* TABS */}

        <div className="mb-8 flex flex-wrap gap-3">
          {sectionNames.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeSection === section
                  ? 'bg-[#8b5e34] text-white shadow-md'
                  : 'bg-white text-[#5b6470] shadow-sm hover:bg-[#f4e8dc]'
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        {/* ITEMS */}

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {activeItems.length > 0 ? (
            activeItems.map((item) => (
              <div
                key={item.name}
                className="card-3d card-3d-shine overflow-hidden rounded-[2rem] bg-white shadow-md"
              >
                {/* IMAGE */}

                <div className="relative h-52 overflow-hidden">
                  <img
                    src={getPricingItemImage(item, activeSection)}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = getPricingItemImage(
                        {},
                        activeSection
                      )
                    }}
                  />
                </div>

                {/* CONTENT */}

                <div className="p-5">
                  <h3 className="text-xl font-bold text-[#1f2937]">
                    {item.name}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#5b6470]">
                    {item.details ||
                      'Premium quality service for your event.'}
                  </p>

                  {/* FOOD MENU */}

                  {activeSection === 'Food' &&
                    item.items?.length > 0 && (
                      <div className="mt-4">
                        <button
                          onClick={() =>
                            toggleFoodDetails(item.name)
                          }
                          className="rounded-full bg-[#f4e8dc] px-4 py-2 text-xs font-semibold text-[#8b5e34] transition hover:bg-[#ead9c5]"
                        >
                          {isFoodExpanded(item.name)
                            ? 'Hide Menu'
                            : `View Menu (${item.items.length})`}
                        </button>

                        {isFoodExpanded(item.name) && (
                          <div className="mt-4 rounded-[1.5rem] bg-[#faf7f2] p-4">
                            <div className="space-y-3">
                              {item.items.map(
                                (menuItem, index) => (
                                  <div
                                    key={`${item.name}-${index}`}
                                    className="rounded-xl bg-white p-3 shadow-sm"
                                  >
                                    <p className="text-sm font-semibold text-[#1f2937]">
                                      {menuItem.name}
                                    </p>

                                    <p className="mt-1 text-xs leading-6 text-[#5b6470]">
                                      {menuItem.details}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  {/* PRICE */}

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-[#8b5e34]">
                        ₹{item.price.toLocaleString()}
                      </p>

                      {item.type === 'perPerson' && (
                        <p className="mt-1 text-xs text-[#5b6470]">
                          Per person
                        </p>
                      )}
                    </div>
                  </div>

                  {/* BUTTON */}

                  <button
                    onClick={() =>
                      handleAddToPackage(item)
                    }
                    disabled={isInPackage(item)}
                    className={`mt-6 w-full rounded-full py-3 text-sm font-semibold transition ${
                      isInPackage(item)
                        ? 'cursor-not-allowed bg-[#e7ddd2] text-[#8b5e34]'
                        : 'bg-[#8b5e34] text-white hover:bg-[#714a28]'
                    }`}
                  >
                    {isInPackage(item)
                      ? 'Added'
                      : 'Add To Package'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-[2rem] bg-white p-8 text-center shadow-md">
              <p className="text-[#5b6470]">
                No items available.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PACKAGE */}

      <div className="lg:sticky lg:top-8 lg:h-fit">
        <div className="glass-panel-3d p-6">
          {/* HEADER */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8b5e34]">
              YOUR PACKAGE
            </p>

            <h2 className="mt-4 text-3xl font-bold text-[#1f2937]">
              Summary
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#5b6470]">
              Customize and calculate your event package.
            </p>
          </div>

          {/* PACKAGE ITEMS */}

          <div className="mt-8 space-y-4">
            {packageItems.length > 0 ? (
              packageItems.map((item) => (
                <div
                  key={item.name}
                  className="rounded-[1.5rem] bg-[#f8f5f0] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-[#1f2937]">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-xs text-[#5b6470]">
                        {formatPrice(item)}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleRemoveItem(item.name)
                      }
                      className="text-xl font-bold text-red-500"
                    >
                      ×
                    </button>
                  </div>

                  {/* QTY */}

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-[#5b6470]">
                        {item.type === 'perPerson' ? 'Guests' : 'Qty'}
                      </p>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.name,
                            e.target.value
                          )
                        }
                        className="input-3d w-16 px-2 py-1 text-center text-sm"
                      />
                    </div>

                    <p className="text-base font-bold text-[#8b5e34]">
                      ₹
                      {itemTotal(item).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] bg-[#f8f5f0] p-6 text-center">
                <p className="text-sm text-[#5b6470]">
                  No items added yet.
                </p>
              </div>
            )}
          </div>

          {/* FORM */}

          <div className="mt-8 space-y-5 border-t border-[#ece3d9] pt-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[#1f2937]">
                Event Date
              </label>

              <input
                type="date"
                value={eventDate}
                min={minBookingDate}
                onChange={(e) => {
                  const value = e.target.value
                  setEventDate(value)
                  setDateError(value ? validateBookingDate(value) : '')
                }}
                className={`input-3d mt-2 text-sm ${
                  dateError ? '!border-red-400' : ''
                }`}
              />
              {dateError && (
                <p className="mt-2 text-sm font-medium text-red-600">{dateError}</p>
              )}
            </div>
          </div>

          {/* PRICE */}

          <div className="mt-8 space-y-4 border-t border-[#ece3d9] pt-6">
            <div className="flex justify-between text-sm text-[#5b6470]">
              <span>Subtotal</span>

              <span>
                ₹{subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-sm text-[#5b6470]">
              <span>Advance</span>

              <span>
                ₹{advance.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between border-t border-[#ece3d9] pt-4 text-xl font-bold text-[#1f2937]">
              <span>Total</span>

              <span>
                ₹{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {confirmError && (
            <p className="mt-4 text-sm font-medium text-red-600">{confirmError}</p>
          )}

          <button
            type="button"
            onClick={handleConfirmPackage}
            disabled={packageItems.length === 0 || confirmLoading}
            className="btn-3d mt-8 w-full rounded-full bg-[#8b5e34] px-6 py-3 text-base text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {confirmLoading ? 'Saving Package...' : 'Confirm Package'}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
    
  )
}