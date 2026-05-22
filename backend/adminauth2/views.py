from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from events.models import Event, Service
from events.serializers import EventSerializer
from bookings.models import Booking
from bookings.serializers import BookingSerializer
from .permissions import IsAdminAli, ADMIN_USERNAME
from django.core.mail import send_mail

ADMIN_PASSWORD = 'Ali@78612'


def build_admin_user():
    user, _ = User.objects.get_or_create(
        username=ADMIN_USERNAME,
        defaults={'email': 'admin@eventease.com'},
    )
    user.is_active = True
    user.is_staff = True
    user.save(update_fields=['is_active', 'is_staff'])
    return user


class AdminLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        name = (request.data.get('name') or request.data.get('username') or '').strip()
        password = request.data.get('password', '')

        if name != ADMIN_USERNAME or password != ADMIN_PASSWORD:
            return Response({'detail': 'Invalid admin credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        admin_user = build_admin_user()
        refresh = RefreshToken.for_user(admin_user)
        return Response(
            {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': admin_user.id,
                    'username': admin_user.username,
                    'is_admin': True,
                },
            }
        )


class AdminEventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all().order_by('-created_at')
    serializer_class = EventSerializer
    permission_classes = [IsAdminAli]

    def perform_create(self, serializer):
        event = serializer.save()
        self._sync_services(event, serializer.validated_data.get('pricing', []))

    def _sync_services(self, event, pricing):
        Service.objects.filter(event=event).delete()
        for item in pricing:
            Service.objects.create(
                event=event,
                name=item.get('name', ''),
                price=item.get('price', 0),
                description=item.get('details', ''),
            )


class AdminEventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAdminAli]

    def perform_update(self, serializer):
        event = serializer.save()
        pricing = self.request.data.get('pricing', event.pricing or [])
        Service.objects.filter(event=event).delete()
        for item in pricing:
            Service.objects.create(
                event=event,
                name=item.get('name', ''),
                price=item.get('price', 0),
                description=item.get('details', ''),
            )


class AdminAllBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAdminAli]

    def get_queryset(self):
        qs = Booking.objects.select_related('event').order_by('-created_at')
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class AdminPendingBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAdminAli]

    def get_queryset(self):
        return (
            Booking.objects.select_related('event')
            .filter(status='Pending')
            .order_by('-created_at')
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


'''class AdminApproveBookingView(APIView):
    permission_classes = [IsAdminAli]

    def patch(self, request, pk):
        try:
            booking = Booking.objects.select_related('event').get(pk=pk)
        except Booking.DoesNotExist:
            return Response({'detail': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action', 'approve')

        if action == 'reject':
            booking.status = 'Rejected'
            booking.save(update_fields=['status'])
            return Response(
                {
                    'message': 'Booking rejected.',
                    'booking': BookingSerializer(booking, context={'request': request}).data,
                }
            )

        booking.status = 'Approved'
        booking.payment_status = 'paid_full'
        booking.amount_paid = booking.total_amount
        from django.utils import timezone
        booking.paid_at = timezone.now()
        booking.save()

        return Response(
            {
                'message': 'Booking approved successfully. User dashboard will show Paid.',
                'booking': BookingSerializer(booking, context={'request': request}).data,
            }
        )'''
class AdminApproveBookingView(APIView):

    permission_classes = [
        IsAdminAli
    ]

    def patch(
        self,
        request,
        pk
    ):

        try:

            booking = (
                Booking.objects
                .select_related(
                    'event'
                )
                .get(pk=pk)
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

        action = request.data.get(
            'action',
            'approve'
        )

        # REJECT

        if action == 'reject':

            booking.status = (
                'Rejected'
            )

            booking.save(
                update_fields=[
                    'status'
                ]
            )

            return Response(

                {

                    'message':
                    'Booking rejected.',

                    'booking':
                    BookingSerializer(

                        booking,

                        context={
                            'request':
                            request
                        }
                    ).data,
                }
            )

        # APPROVE

        booking.status = (
            'Approved'
        )

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

        from django.utils import (
            timezone
        )

        booking.paid_at = (
            timezone.now()
        )

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
                    }
                ).data,
            }
        )