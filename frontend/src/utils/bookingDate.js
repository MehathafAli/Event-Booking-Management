/** Today's date as YYYY-MM-DD in local timezone (for date inputs). */
export function getMinBookingDate() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function validateBookingDate(dateStr) {
  if (!dateStr) {
    return 'Please select an event date before confirming your package.'
  }
  if (dateStr < getMinBookingDate()) {
    return 'You cannot book a past date. Please select today or a future date.'
  }
  return ''
}

export const SLOT_BOOKED_MESSAGE =
  'This slot is already booked by someone else. Please choose another function hall or select a different date.'
