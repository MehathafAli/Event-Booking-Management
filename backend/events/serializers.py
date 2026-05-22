from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from core.validators import validate_phone_number

from .models import Event, Service, Contact

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'price', 'description']

class EventSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'description',
            'category',
            'location',
            'excerpt',
            'images',
            'pricing',
            'services',
        ]

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'phone', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_phone(self, value):
        try:
            return validate_phone_number(value)
        except DjangoValidationError as exc:
            msg = exc.messages[0] if getattr(exc, 'messages', None) else str(exc)
            raise serializers.ValidationError(msg)
