from rest_framework import serializers
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
            'pricing',
            'services',
        ]

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'phone', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']
