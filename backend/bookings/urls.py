from django.urls import path
from .views import (
    BookingCreateView,
    MyBookingsView,
    PackageBookingCreateView,
    BookingDetailView,
    BookingConfirmView,
    BookingPaymentView,
)

urlpatterns = [
    path('bookings/', BookingCreateView.as_view(), name='booking-create'),
    path('bookings/package/', PackageBookingCreateView.as_view(), name='package-booking-create'),
    path('bookings/<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),
    path('bookings/<int:pk>/confirm/', BookingConfirmView.as_view(), name='booking-confirm'),
    path('bookings/<int:pk>/pay/', BookingPaymentView.as_view(), name='booking-pay'),
    path('my-bookings/', MyBookingsView.as_view(), name='my-bookings'),
]
