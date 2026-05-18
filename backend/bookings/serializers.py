from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_category = serializers.CharField(source='event.category', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'user',
            'event',
            'event_title',
            'event_category',
            'location',
            'booking_date',
            'guest_count',
            'package_items',
            'total_amount',
            'status',
            'customer_name',
            'customer_phone',
            'customer_email',
            'customer_address',
            'is_confirmed',
            'created_at',
        ]
        read_only_fields = ['status', 'is_confirmed', 'created_at', 'user']


class PackageBookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'id',
            'event',
            'booking_date',
            'guest_count',
            'package_items',
            'total_amount',
            'location',
        ]
        read_only_fields = ['id']

    def validate_booking_date(self, value):
        if not value:
            raise serializers.ValidationError('Please select an event date.')
        return value

    def validate_package_items(self, value):
        if not value:
            raise serializers.ValidationError('Package must include at least one item.')
        return value


class BookingConfirmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'customer_name',
            'customer_phone',
            'customer_email',
            'customer_address',
        ]

    def validate_customer_name(self, value):
        if not value.strip():
            raise serializers.ValidationError('Full name is required.')
        return value.strip()

    def validate_customer_phone(self, value):
        if not value.strip():
            raise serializers.ValidationError('Phone number is required.')
        return value.strip()

    def validate_customer_email(self, value):
        if not value.strip():
            raise serializers.ValidationError('Email is required.')
        return value.strip()
