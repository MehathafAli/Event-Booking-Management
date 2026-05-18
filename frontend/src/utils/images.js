const DEFAULT_EVENT_IMAGE =
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'

const SECTION_FALLBACKS = {
  'Function Halls':
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
  Food: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  Decorations:
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
  Services:
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
}

export function getEventCoverImage(event) {
  if (event?.images?.length) {
    return event.images[0]
  }

  const firstWithImage = event?.pricing?.find((item) => item.image)
  if (firstWithImage?.image) {
    return firstWithImage.image
  }

  return DEFAULT_EVENT_IMAGE
}

export function getPricingItemImage(item, section) {
  if (item?.image) {
    return item.image
  }

  return SECTION_FALLBACKS[section] || DEFAULT_EVENT_IMAGE
}

export { DEFAULT_EVENT_IMAGE }
