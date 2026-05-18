from django.db import models
from django.contrib.auth.models import User
from events.models import Event


class Booking(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    user = models.ForeignKey(
        User,
        related_name='bookings',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    event = models.ForeignKey(Event, related_name='bookings', on_delete=models.CASCADE)
    location = models.CharField(max_length=255, blank=True, default='')
    booking_date = models.DateField()
    guest_count = models.PositiveIntegerField(default=1)
    package_items = models.JSONField(default=list, blank=True)
    total_amount = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    customer_name = models.CharField(max_length=100, blank=True, default='')
    customer_phone = models.CharField(max_length=20, blank=True, default='')
    customer_email = models.EmailField(blank=True, default='')
    customer_address = models.TextField(blank=True, default='')
    is_confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        label = self.customer_name or (self.user.username if self.user else 'Guest')
        return f'{label} - {self.event.title}'
