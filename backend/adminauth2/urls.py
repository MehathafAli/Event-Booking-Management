from django.urls import path
from .views import (
    AdminLoginView,
    AdminEventListCreateView,
    AdminEventDetailView,
    AdminAllBookingsView,
    AdminBookingDetailView,
    AdminPendingBookingsView,
    AdminApproveBookingView,
)

urlpatterns = [
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('admin/events/', AdminEventListCreateView.as_view(), name='admin-events'),
    path('admin/events/<int:pk>/', AdminEventDetailView.as_view(), name='admin-event-detail'),
    path('admin/bookings/', AdminAllBookingsView.as_view(), name='admin-all-bookings'),
    path('admin/bookings/pending/', AdminPendingBookingsView.as_view(), name='admin-pending-bookings'),
    path('admin/bookings/<int:pk>/', AdminBookingDetailView.as_view(), name='admin-booking-detail'),
    path('admin/bookings/<int:pk>/approve/', AdminApproveBookingView.as_view(), name='admin-approve-booking'),
]
