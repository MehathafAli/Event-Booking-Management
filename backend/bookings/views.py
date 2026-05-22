from django.db.models import Q

from django.utils import timezone

from django.core.mail import send_mail

from rest_framework import (
    generics,
    permissions,
    status,
)

from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
)

from rest_framework.response import (
    Response
)

from rest_framework.views import (
    APIView
)

from .models import Booking

from .serializers import (

    BookingSerializer,

    PackageBookingCreateSerializer,

    BookingConfirmSerializer,

    BookingPaymentSerializer,
)


# PACKAGE BOOKING

class PackageBookingCreateView(
    generics.CreateAPIView
):

    queryset = Booking.objects.all()

    serializer_class = (
        PackageBookingCreateSerializer
    )

    permission_classes = [
        permissions.AllowAny
    ]

    def perform_create(
        self,
        serializer
    ):

        user = (

            self.request.user

            if self.request.user.is_authenticated

            else None
        )

        booking = serializer.save(
            user=user
        )

        # AUTO EMAIL

        if (

            user

            and user.email

            and not booking.customer_email

        ):

            booking.customer_email = (
                user.email
            )

            booking.save(
                update_fields=[
                    'customer_email'
                ]
            )


# BOOKING DETAIL

class BookingDetailView(
    generics.RetrieveAPIView
):

    queryset = (
        Booking.objects.select_related(
            'event'
        )
    )

    serializer_class = (
        BookingSerializer
    )

    permission_classes = [
        permissions.AllowAny
    ]

    def get_serializer_context(
        self
    ):

        context = (
            super()
            .get_serializer_context()
        )

        context['request'] = (
            self.request
        )

        return context


# CONFIRM BOOKING

class BookingConfirmView(
    APIView
):

    permission_classes = [
        permissions.AllowAny
    ]

    def patch(
        self,
        request,
        pk
    ):

        try:

            booking = (
                Booking.objects.get(
                    pk=pk
                )
            )

        except Booking.DoesNotExist:

            return Response(

                {
                    'detail':
                    'Booking not found.'
                },

                status=
                status.HTTP_404_NOT_FOUND,
            )

        # ALREADY CONFIRMED

        if booking.is_confirmed:

            return Response(

                {
                    'message':
                    'Booking already confirmed.',

                    'booking':
                    BookingSerializer(

                        booking,

                        context={
                            'request':
                            request
                        },
                    ).data,
                }
            )

        serializer = (
            BookingConfirmSerializer(

                booking,

                data=request.data,

                partial=True,
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save(
            is_confirmed=True
        )

        # AUTO USER

        if (

            request.user.is_authenticated

            and not booking.user

        ):

            booking.user = (
                request.user
            )

        # AUTO EMAIL

        if (

            request.user.is_authenticated

            and request.user.email

            and not booking.customer_email

        ):

            booking.customer_email = (
                request.user.email
            )

        booking.save()

        return Response(

            {
                'message':
                'Details saved successfully.',

                'booking':
                BookingSerializer(

                    booking,

                    context={
                        'request':
                        request
                    },
                ).data,
            }
        )


# PAYMENT

class BookingPaymentView(
    APIView
):

    permission_classes = [
        permissions.AllowAny
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def post(
        self,
        request,
        pk
    ):

        try:

            booking = (
                Booking.objects.get(
                    pk=pk
                )
            )

        except Booking.DoesNotExist:

            return Response(

                {
                    'detail':
                    'Booking not found.'
                },

                status=
                status.HTTP_404_NOT_FOUND,
            )

        # DETAILS REQUIRED

        if not booking.is_confirmed:

            return Response(

                {
                    'detail':
                    'Please confirm booking details first.'
                },

                status=
                status.HTTP_400_BAD_REQUEST,
            )

        serializer = (
            BookingPaymentSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        payment_method = (
            serializer.validated_data[
                'payment_method'
            ]
        )

        payment_photo = (
            serializer.validated_data[
                'payment_photo'
            ]
        )

        payment_type = (
            serializer.validated_data.get(
                'payment_type',
                'advance',
            )
        )

        # AUTO ADVANCE

        if (

            not booking.advance_amount

            or booking.advance_amount <= 0

        ):

            booking.advance_amount = round(

                booking.total_amount * 0.5
            )

        # ADVANCE

        if payment_type == 'advance':

            # ALREADY PAID ADVANCE

            if booking.amount_paid > 0:

                return Response(

                    {
                        'detail':
                        'Advance already paid.'
                    },

                    status=
                    status.HTTP_400_BAD_REQUEST,
                )

            pay_amount = (
                booking.advance_amount
            )

        # REMAINING

        else:

            pay_amount = (

                booking.total_amount -

                booking.amount_paid
            )

            if pay_amount <= 0:

                return Response(

                    {
                        'detail':
                        'Booking already fully paid.'
                    },

                    status=
                    status.HTTP_400_BAD_REQUEST,
                )

        # SAVE PAYMENT

        booking.payment_method = (
            payment_method
        )

        booking.payment_photo = (
            payment_photo
        )

        booking.payment_type = (
            payment_type
        )

        # ADD PAYMENT

        booking.amount_paid += (
            pay_amount
        )

        # REMAINING

        booking.remaining_amount = max(

            booking.total_amount -

            booking.amount_paid,

            0
        )

        # PAYMENT STATUS

        if booking.amount_paid <= 0:

            booking.payment_status = (
                'unpaid'
            )

        elif (

            booking.amount_paid <

            booking.total_amount

        ):

            booking.payment_status = (
                'paid_partial'
            )

        else:

            booking.payment_status = (
                'paid_full'
            )

        booking.status = 'Pending'

        booking.paid_at = (
            timezone.now()
        )

        booking.save()

        # AUTO USER

        if (

            request.user.is_authenticated

            and not booking.user

        ):

            booking.user = (
                request.user
            )

            booking.save(
                update_fields=['user']
            )

        return Response(

            {

                'message':
                'Payment submitted successfully.',

                'pay_amount':
                pay_amount,

                'remaining_amount':
                booking.remaining_amount,

                'booking':
                BookingSerializer(

                    booking,

                    context={
                        'request':
                        request
                    },
                ).data,
            }
        )


# BOOKING APPROVAL

# BOOKING APPROVAL

class BookingApproveView(
    APIView
):

    permission_classes = [
        permissions.AllowAny
    ]

    def patch(
        self,
        request,
        pk
    ):

        try:

            booking = (
                Booking.objects.get(
                    pk=pk
                )
            )

        except Booking.DoesNotExist:

            return Response(

                {
                    'detail':
                    'Booking not found.'
                },

                status=
                status.HTTP_404_NOT_FOUND,
            )

        # APPROVE

        booking.status = 'Approved'

        booking.is_confirmed = True

        # PAYMENT STATUS

        if (

            booking.amount_paid >=
            booking.total_amount

        ):

            booking.payment_status = (
                'paid_full'
            )

        elif booking.amount_paid > 0:

            booking.payment_status = (
                'paid_partial'
            )

        else:

            booking.payment_status = (
                'unpaid'
            )

        # REMAINING

        booking.remaining_amount = max(

            booking.total_amount -

            booking.amount_paid,

            0
        )

        booking.save()

        # CUSTOMER EMAIL

        customer_email = (

            booking.customer_email

            or (

                booking.user.email

                if booking.user

                else None
            )
        )

        # SEND EMAIL

        if customer_email:

            package_details = ''

            for item in (
                booking.package_items
            ):

                line_total = (

                    item.get(
                        'line_total'
                    )

                    or

                    (
                        item.get(
                            'price',
                            0
                        ) *

                        item.get(
                            'quantity',
                            1
                        )
                    )
                )

                package_details += (

                    f"- {item.get('name')} "

                    f"(Qty: {item.get('quantity', 1)}) "

                    f"(₹{line_total})\n"
                )

            send_mail(

                subject=
                f'{booking.event.title} Booking Approved',

                message=f'''
Hello {booking.customer_name},

Your booking has been approved successfully.

EVENT DETAILS
-------------------------
Event:
{booking.event.title}

Location:
{booking.location}

Date:
{booking.booking_date}

PAYMENT DETAILS
-------------------------
Payment Type:
{booking.payment_type}

Total Amount:
₹{booking.total_amount}

Amount Paid:
₹{booking.amount_paid}

Remaining Amount:
₹{booking.remaining_amount}

Payment Status:
{booking.payment_status}

BOOKED PACKAGE
-------------------------
{package_details}

IMPORTANT
-------------------------
Please pay the remaining amount before the event date.

Thank you for choosing EventEase.
''',

                from_email=None,

                recipient_list=[
                    customer_email
                ],

                fail_silently=False,
            )

        return Response(

            {

                'message':
                'Booking approved successfully.',

                'booking':
                BookingSerializer(

                    booking,

                    context={
                        'request':
                        request
                    },
                ).data,
            }
        )

# SIMPLE BOOKING

class BookingCreateView(
    generics.CreateAPIView
):

    queryset = Booking.objects.all()

    serializer_class = (
        BookingSerializer
    )

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def perform_create(
        self,
        serializer
    ):

        serializer.save(
            user=self.request.user
        )


# USER BOOKINGS

class MyBookingsView(
    generics.ListAPIView
):

    serializer_class = (
        BookingSerializer
    )

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(
        self
    ):

        user = self.request.user

        email = (
            user.email or ''
        ).strip()

        filters = Q(user=user)

        if email:

            filters |= Q(
                customer_email__iexact=
                email
            )

        return (

            Booking.objects.filter(
                filters
            )

            .select_related(
                'event'
            )

            .distinct()

            .order_by(
                '-created_at'
            )
        )

    def get_serializer_context(
        self
    ):

        context = (
            super()
            .get_serializer_context()
        )

        context['request'] = (
            self.request
        )

        return context