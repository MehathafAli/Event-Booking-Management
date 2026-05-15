from django.urls import path
from .views import EventListView, EventDetailView, ServiceListView, ContactCreateView

urlpatterns = [
    path('events/', EventListView.as_view(), name='event-list'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('services/', ServiceListView.as_view(), name='service-list'),
    path('contact/', ContactCreateView.as_view(), name='contact-create'),
]
