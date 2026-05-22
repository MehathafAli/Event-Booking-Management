from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from core.validators import validate_email_address, validate_phone_number

from .availability import (
    SLOT_BOOKED_MESSAGE,
    find_booked_hall_conflicts,
    hall_names_from_package,
    validate_booking_date_not_past,
)
from .models import Booking


def _validation_error_message(exc):
    if hasattr(exc, 'messages') and exc.messages:
        return exc.messages[0]
    return str(exc)


class BookingSerializer(
    serializers.ModelSerializer
):

    event_title = serializers.CharField(
        source='event.title',
        read_only=True
    )

    event_category = (
        serializers.CharField(
            source='event.category',
            read_only=True
        )
    )

    balance_due = (
        serializers.SerializerMethodField()
    )

    payment_photo_url = (
        serializers.SerializerMethodField()
    )

    display_status = (
        serializers.SerializerMethodField()
    )

    remaining_amount = (
        serializers.SerializerMethodField()
    )

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

            'subtotal',

            'total_amount',

            'advance_amount',

            'amount_paid',

            'remaining_amount',

            'balance_due',

            'payment_type',

            'payment_status',

            'payment_method',

            'payment_photo',

            'payment_photo_url',

            'paid_at',

            'status',

            'display_status',

            'customer_name',

            'customer_phone',

            'customer_email',

            'customer_address',

            'is_confirmed',

            'admin_notes',

            'created_at',
        ]

        read_only_fields = [

            'status',

            'is_confirmed',

            'created_at',

            'user',

            'advance_amount',

            'amount_paid',

            'payment_status',

            'payment_method',

            'payment_photo',

            'paid_at',

            'remaining_amount',

            'balance_due',

            'display_status',
        ]

    def get_balance_due(self, obj):
        return max(obj.total_amount - obj.amount_paid, 0)

    def get_remaining_amount(self, obj):
        return max(obj.total_amount - obj.amount_paid, 0)

    def get_payment_photo_url(self, obj):
        if not obj.payment_photo:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.payment_photo.url)
        return obj.payment_photo.url

    def get_display_status(self, obj):
        if obj.payment_status == 'pending_review':
            return 'Payment Verification Pending'
        if obj.status == 'Approved' and obj.payment_status == 'paid_full':
            return 'Paid Full'
        if obj.status == 'Approved' and obj.payment_status == 'paid_partial':
            return 'Advance Paid'
        if obj.status == 'Rejected':
            return 'Rejected'
        if obj.status == 'Pending':
            return 'Pending Approval'
        return 'Unpaid'


class AdminBookingSerializer(BookingSerializer):

    class Meta(BookingSerializer.Meta):

        read_only_fields = [
            'created_at',
            'user',
            'advance_amount',
            'balance_due',
            'display_status',
            'payment_photo_url',
            'event_title',
            'event_category',
            'remaining_amount',
        ]


# CREATE BOOKING

class PackageBookingCreateSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Booking

        fields = [

            'id',

            'event',

            'booking_date',

            'guest_count',

            'package_items',

            'subtotal',

            'total_amount',

            'location',

            'advance_amount',
        ]

        read_only_fields = [
            'id',
            'advance_amount',
        ]

    # DATE

    def validate_booking_date(self, value):
        if not value:
            raise serializers.ValidationError('Please select an event date.')

        past_error = validate_booking_date_not_past(value)
        if past_error:
            raise serializers.ValidationError(past_error)

        return value

    def validate(self, attrs):
        event = attrs.get('event')
        booking_date = attrs.get('booking_date')
        package_items = attrs.get('package_items') or []

        if event and booking_date:
            selected_halls = hall_names_from_package(package_items)
            conflicts = find_booked_hall_conflicts(
                event.id,
                booking_date,
                selected_halls,
            )
            if conflicts:
                halls = ', '.join(conflicts)
                raise serializers.ValidationError(
                    {
                        'detail': (
                            f'{SLOT_BOOKED_MESSAGE} '
                            f'Already booked: {halls}.'
                        )
                    }
                )

        return attrs

    # PACKAGE

    def validate_package_items(
        self,
        value
    ):

        if not value:

            raise serializers.ValidationError(
                'Package must include at least one item.'
            )

        return value

    # CREATE

    def create(
        self,
        validated_data
    ):

        total = validated_data.get(
            'total_amount',
            0
        )

        validated_data[
            'advance_amount'
        ] = round(total * 0.5)

        return super().create(
            validated_data
        )


# CONFIRM DETAILS

class BookingConfirmSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Booking

        fields = [

            'customer_name',

            'customer_phone',

            'customer_email',

            'customer_address',
        ]

    # NAME

    def validate_customer_name(
        self,
        value
    ):

        if not value.strip():

            raise serializers.ValidationError(
                'Full name is required.'
            )

        return value.strip()

    # PHONE

    def validate_customer_phone(self, value):
        try:
            return validate_phone_number(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(_validation_error_message(exc))

    def validate_customer_email(self, value):
        try:
            return validate_email_address(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(_validation_error_message(exc))


# PAYMENT

class BookingPaymentSerializer(
    serializers.Serializer
):

    payment_type = (
        serializers.ChoiceField(
            choices=[
                'advance',
                'full'
            ],
            default='advance'
        )
    )

    payment_method = (
        serializers.ChoiceField(
            choices=[
                'upi',
                'card',
                'netbanking',
                'wallet'
            ]
        )
    )

    payment_photo = (
        serializers.ImageField(
            required=True
        )
    )