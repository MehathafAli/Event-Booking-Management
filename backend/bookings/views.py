from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Booking
from .serializers import (
    BookingSerializer,
    PackageBookingCreateSerializer,
    BookingConfirmSerializer,
)


class PackageBookingCreateView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = PackageBookingCreateSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)


class BookingDetailView(generics.RetrieveAPIView):
    queryset = Booking.objects.select_related('event')
    serializer_class = BookingSerializer
    permission_classes = [permissions.AllowAny]


class BookingConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def patch(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response({'detail': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

        if booking.is_confirmed:
            return Response(
                {'detail': 'This booking is already confirmed.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = BookingConfirmSerializer(booking, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(is_confirmed=True)

        return Response(
            {
                'message': 'Slot booked! Our team will contact you in 30 min.',
                'booking': BookingSerializer(booking).data,
            }
        )


class BookingCreateView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MyBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).order_by('-created_at')
