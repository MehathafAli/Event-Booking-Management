from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'event',
        'customer_name',
        'customer_email',
        'booking_date',
        'total_amount',
        'advance_amount',
        'payment_status',
        'status',
    )
    list_filter = ('status', 'payment_status', 'booking_date')
    search_fields = (
        'customer_name',
        'customer_email',
        'event__title',
        'location',
    )
    readonly_fields = ('created_at',)
    fieldsets = (
        (None, {
            'fields': (
                'event',
                'booking_date',
                'guest_count',
                'location',
                'package_items',
                'subtotal',
                'total_amount',
                'advance_amount',
            )
        }),
        ('Customer Details', {
            'fields': (
                'customer_name',
                'customer_phone',
                'customer_email',
                'customer_address',
            )
        }),
        ('Payment & Status', {
            'fields': (
                'payment_type',
                'payment_method',
                'payment_status',
                'amount_paid',
                'remaining_amount',
                'status',
                'admin_notes',
            )
        }),
        ('Advanced', {
            'classes': ('collapse',),
            'fields': ('created_at',),
        }),
    )
