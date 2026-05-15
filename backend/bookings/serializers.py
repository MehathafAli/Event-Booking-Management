from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'user', 'event', 'location', 'booking_date', 'total_amount', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']
