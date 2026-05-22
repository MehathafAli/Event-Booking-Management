from django.core.mail import send_mail


def get_customer_email(booking):
    if booking.customer_email:
        return booking.customer_email
    if booking.user and booking.user.email:
        return booking.user.email
    return None


def format_package_lines(package_items):
    lines = []
    for item in package_items or []:
        line_total = item.get('line_total') or (
            item.get('price', 0) * item.get('quantity', 1)
        )
        lines.append(
            f"- {item.get('name')} (Qty: {item.get('quantity', 1)}) (₹{line_total})"
        )
    return '\n'.join(lines) if lines else '- (no items listed)'


def send_booking_rejection_email(booking, reason):
    customer_email = get_customer_email(booking)
    if not customer_email:
        return False

    customer_name = booking.customer_name or 'Customer'
    package_details = format_package_lines(booking.package_items)

    send_mail(
        subject=f'{booking.event.title} — Booking Rejected',
        message=f'''Hello {customer_name},

We regret to inform you that your booking request has been rejected by our admin team.

EVENT DETAILS
-------------------------
Event: {booking.event.title}
Date: {booking.booking_date}
Location: {booking.location or '—'}

REASON FOR REJECTION
-------------------------
{reason}

PAYMENT & REFUND
-------------------------
Amount paid: ₹{booking.amount_paid}
Total booking amount: ₹{booking.total_amount}

If you have made a payment, your refund will be processed within 24 hours to your original payment method.

You may place a new booking with a different function hall or another available date on EventEase.

If you have questions, please contact our support team.

Thank you,
EventEase Team
''',
        from_email=None,
        recipient_list=[customer_email],
        fail_silently=False,
    )
    return True
