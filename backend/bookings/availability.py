from django.utils import timezone

from .models import Booking

HALL_SECTION = 'Function Halls'
ACTIVE_STATUSES = ('Pending', 'Approved')

SLOT_BOOKED_MESSAGE = (
    'This slot is already booked by someone else. '
    'Please choose another function hall or select a different date.'
)


def is_hall_item(item):
    section = (item.get('section') or '').strip()
    if section == HALL_SECTION:
        return True
    name = (item.get('name') or '').lower()
    return any(
        keyword in name
        for keyword in ('hall', 'venue', 'ballroom', 'lawn', 'banquet', 'palace')
    )


def hall_names_from_package(package_items):
    names = set()
    for item in package_items or []:
        name = (item.get('name') or '').strip()
        if name and is_hall_item(item):
            names.add(name)
    return names


def find_booked_hall_conflicts(event_id, booking_date, hall_names):
    if not hall_names:
        return []

    conflicts = set()
    existing = Booking.objects.filter(
        event_id=event_id,
        booking_date=booking_date,
        status__in=ACTIVE_STATUSES,
    )

    for booking in existing:
        booked = hall_names_from_package(booking.package_items)
        overlap = hall_names & booked
        if overlap:
            conflicts.update(overlap)

    return sorted(conflicts)


def validate_booking_date_not_past(booking_date):
    today = timezone.localdate()
    if booking_date < today:
        return 'You cannot book a past date. Please select today or a future date.'
    return None
